import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { CODING_PROBLEMS } from './src/data/codingProblems.ts';
import { executeCodingSubmission, type JavaAiOutput } from './serverCodingRunner.ts';
import type { CodingLanguageId, CodingTestCase } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface GeminiCallOptions {
  contents: string;
  systemInstruction: string;
  responseMimeType?: string;
  responseSchema?: unknown;
}

class RequestTimeoutError extends Error {
  status = 504;
  constructor(message = 'The AI Tutor took too long to respond. Please try again.') {
    super(message);
    this.name = 'RequestTimeoutError';
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 12000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new RequestTimeoutError()), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 11000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

function extractErrorMessage(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { error?: { message?: string }; message?: string };
      if (parsed?.error?.message) return parsed.error.message;
      if (parsed?.message) return parsed.message;
    } catch {
      // Keep original message
    }
  }
  return raw;
}

function getReadableApiError(error: unknown): { status: number; message: string } {
  const errObj = error as { status?: number; message?: string };
  const rawMessage = extractErrorMessage(errObj?.message || 'Unable to reach AI Tutor right now.');
  const status = typeof errObj?.status === 'number' ? errObj.status : 500;

  if (rawMessage.includes('GEMINI_API_KEY is not configured')) {
    return {
      status: 500,
      message: 'API key is not configured. Please check Settings > Secrets.',
    };
  }
  if (status === 403 || rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('API_KEY_INVALID')) {
    return {
      status: 403,
      message: 'Gemini API authentication failed. Please check your API key in Settings > Secrets.',
    };
  }
  if (status === 429 || rawMessage.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      message: 'Rate limit reached. Please wait a moment and try again.',
    };
  }
  if (status === 504 || rawMessage.includes('took too long')) {
    return {
      status: 504,
      message: 'The AI service timed out while generating your answer. Please try again.',
    };
  }
  if (status === 503 || rawMessage.includes('UNAVAILABLE') || rawMessage.includes('high demand')) {
    return {
      status: 503,
      message: 'The AI Tutor service is experiencing temporary high demand. Please try again in a few seconds.',
    };
  }
  return {
    status: status >= 400 && status < 600 ? status : 500,
    message: rawMessage,
  };
}

function isRetryableError(error: unknown): boolean {
  const errObj = error as { status?: number; message?: string };
  const status = errObj?.status;
  const msg = errObj?.message || '';
  return (
    status === 504 ||
    status === 503 ||
    status === 502 ||
    status === 500 ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('took too long') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT')
  );
}

async function generateWithResilience(ai: GoogleGenAI, options: GeminiCallOptions) {
  const models: Array<{ name: string; useThinkingLow: boolean; timeoutMs: number }> = [
    { name: 'gemini-4-hydrogen', useThinkingLow: true, timeoutMs: 12000 },
    { name: 'gemini-3.1-flash-lite', useThinkingLow: false, timeoutMs: 12000 },
  ];

  let lastError: unknown;
  for (let idx = 0; idx < models.length; idx++) {
    const candidate = models[idx];
    try {
      const config: Record<string, unknown> = {
        systemInstruction: options.systemInstruction,
      };
      if (candidate.useThinkingLow) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }
      if (options.responseMimeType) {
        config.responseMimeType = options.responseMimeType;
      }
      if (options.responseSchema) {
        config.responseSchema = options.responseSchema;
      }

      return await withTimeout(
        ai.models.generateContent({
          model: candidate.name,
          contents: options.contents,
          config,
        }),
        candidate.timeoutMs
      );
    } catch (error) {
      lastError = error;
      if (idx === models.length - 1 || !isRetryableError(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/tutor/chat', async (req, res) => {
    try {
      const { messages, language, codeContext } = req.body as {
        messages?: ChatMessagePayload[];
        language?: string;
        codeContext?: string;
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Please provide at least one message.' });
        return;
      }

      const ai = getAiClient();
      const focusNote =
        language && language !== 'General'
          ? `The student is currently focusing on ${language}. Prioritize examples in ${language} unless they ask about another language.`
          : 'The student is learning beginner programming across Python, Java, C++, and SQL.';

      const codeNote = codeContext?.trim()
        ? `\n\nThe student also shared this code from the Code Lab:\n\`\`\`\n${codeContext.trim()}\n\`\`\``
        : '';

      const systemInstruction = `You are a patient, encouraging, beginner-friendly coding tutor for "Smart AI Coding Tutor".
${focusNote}
Guidelines:
- Explain concepts in plain, everyday language with short paragraphs.
- Include short, clear, runnable code examples in fenced markdown blocks (\`\`\`python, \`\`\`java, \`\`\`cpp, or \`\`\`sql).
- Point out common beginner mistakes gently and suggest one small next step to practice.
- Keep responses concise (around 120-250 words unless a detailed walkthrough is requested).`;

      const recentMessages = messages.slice(-10);
      const formattedHistory = recentMessages
        .slice(0, -1)
        .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
        .join('\n\n');

      const latestUserMessage = recentMessages[recentMessages.length - 1]?.content ?? '';
      const prompt = formattedHistory
        ? `Previous conversation:\n${formattedHistory}\n\nStudent's new question: ${latestUserMessage}${codeNote}`
        : `${latestUserMessage}${codeNote}`;

      const response = await generateWithResilience(ai, {
        contents: prompt,
        systemInstruction,
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'Received an empty response from the AI Tutor.' });
        return;
      }

      res.json({ reply });
    } catch (error) {
      const { status, message } = getReadableApiError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/lab/run', async (req, res) => {
    try {
      const { language, code } = req.body as {
        language?: string;
        code?: string;
      };

      if (!code || !code.trim()) {
        res.status(400).json({ error: 'Write some code before running it.' });
        return;
      }

      const targetLanguage =
        language === 'java'
          ? 'Java'
          : language === 'cpp'
            ? 'C++'
            : language === 'sql'
              ? 'SQL'
              : 'Python';
      const ai = getAiClient();

      const response = await generateWithResilience(ai, {
        contents: `Language: ${targetLanguage}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nEvaluate this beginner program:
1. If it is valid ${targetLanguage}, return the exact console output (or formatted query result table for SQL) in "stdout" and set "hasError" to false. If there is a syntax or runtime error, set "hasError" to true and provide a clear, beginner-friendly error message in "stdout".
2. Provide a short 1-2 sentence overview in "explanation".
3. Provide a clear line-by-line (or block-by-block) walkthrough in "lineByLine" so a beginner understands every part of the code.
4. List any syntax mistakes, runtime pitfalls, or common beginner bad habits in "mistakes" (return an empty array if the code is clean).
5. Provide 2-3 concise core programming "theoryPoints" illustrated by this code.`,
        systemInstruction:
          'You are a precise code evaluator and beginner coding mentor for Python, Java, C++, and SQL. Simulate exact console stdout, SQL query result tables, or compiler/syntax errors accurately, explain code clearly line by line, spot beginner mistakes, and highlight core theory points.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stdout: {
              type: Type.STRING,
              description: 'Exact console output or compiler/runtime error message.',
            },
            hasError: {
              type: Type.BOOLEAN,
              description: 'True if the code contains a syntax or runtime error.',
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief 1-2 sentence beginner-friendly overview of the output or fix.',
            },
            lineByLine: {
              type: Type.ARRAY,
              description: 'Step-by-step explanation of lines or blocks in the code.',
              items: {
                type: Type.OBJECT,
                properties: {
                  lines: {
                    type: Type.STRING,
                    description: 'Short label like "Lines 1-2" or the statement snippet.',
                  },
                  detail: {
                    type: Type.STRING,
                    description: 'Plain-English explanation of what this part does.',
                  },
                },
                required: ['lines', 'detail'],
              },
            },
            mistakes: {
              type: Type.ARRAY,
              description: 'Mistakes or beginner warnings detected in the code.',
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: {
                    type: Type.STRING,
                    description: 'What the mistake or potential pitfall is.',
                  },
                  fix: {
                    type: Type.STRING,
                    description: 'How to fix or improve it.',
                  },
                },
                required: ['issue', 'fix'],
              },
            },
            theoryPoints: {
              type: Type.ARRAY,
              description: '2-3 foundational programming theory points related to this code.',
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ['stdout', 'hasError', 'explanation', 'lineByLine', 'mistakes', 'theoryPoints'],
        },
      });

      const rawJson = (response.text ?? '{}')
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '');
      const parsed = JSON.parse(rawJson) as {
        stdout?: string;
        hasError?: boolean;
        explanation?: string;
        lineByLine?: Array<{ lines: string; detail: string }>;
        mistakes?: Array<{ issue: string; fix: string }>;
        theoryPoints?: string[];
      };

      res.json({
        stdout: parsed.stdout ?? '',
        hasError: Boolean(parsed.hasError),
        explanation: parsed.explanation ?? 'Execution completed.',
        lineByLine: Array.isArray(parsed.lineByLine) ? parsed.lineByLine : [],
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
        theoryPoints: Array.isArray(parsed.theoryPoints) ? parsed.theoryPoints : [],
      });
    } catch (error) {
      const { status, message } = getReadableApiError(error);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/coding-practice/execute', async (req, res) => {
    try {
      const { problemId, language, code, mode } = req.body as {
        problemId?: string;
        language?: string;
        code?: string;
        mode?: string;
      };

      const problem = CODING_PROBLEMS.find((p) => p.id === problemId);
      if (!problem) {
        res.status(404).json({ error: 'Selected coding problem was not found.' });
        return;
      }

      if (language !== 'python' && language !== 'java' && language !== 'cpp') {
        res.status(400).json({ error: 'Unsupported language. Choose Python, Java, or C++.' });
        return;
      }

      if (typeof code !== 'string' || !code.trim()) {
        res.status(400).json({ error: 'Write some code before running or submitting.' });
        return;
      }

      if (code.length > 25000) {
        res.status(400).json({ error: 'Code is too long (maximum 25,000 characters).' });
        return;
      }

      const execMode: 'run' | 'submit' = mode === 'submit' ? 'submit' : 'run';
      const targetLang: CodingLanguageId = language;

      const evaluateJavaWithAi = async (
        javaCode: string,
        cases: CodingTestCase[]
      ): Promise<JavaAiOutput> => {
        const ai = getAiClient();
        const casesBlock = cases
          .map((tc, i) => `Case ${i + 1} stdin:\n\`\`\`\n${tc.input}\n\`\`\``)
          .join('\n\n');

        const response = await generateWithResilience(ai, {
          contents: `Compile and execute the following Java program strictly against each stdin test case. Do NOT judge or fix the code—just report exact compilation errors if invalid Java, or exact stdout/stderr for each stdin case in order.

Java code:
\`\`\`java
${javaCode}
\`\`\`

Test cases (${cases.length} cases in exact order):
${casesBlock}`,
          systemInstruction:
            'You are a strict Java 17 compiler and JVM runtime simulator. Check exact Java syntax and types. If there is any compilation error, set compiled=false and provide the exact compiler diagnostic in compileError with an empty cases array. Otherwise set compiled=true, compileError="", and return exact stdout, stderr, and runtimeError boolean for each stdin test case in the exact same order.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              compiled: { type: Type.BOOLEAN },
              compileError: { type: Type.STRING },
              cases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stdout: { type: Type.STRING },
                    stderr: { type: Type.STRING },
                    runtimeError: { type: Type.BOOLEAN },
                  },
                  required: ['stdout', 'stderr', 'runtimeError'],
                },
              },
            },
            required: ['compiled', 'compileError', 'cases'],
          },
        });

        const rawJson = (response.text ?? '{}')
          .trim()
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```$/, '');
        const parsed = JSON.parse(rawJson) as Partial<JavaAiOutput>;
        return {
          compiled: Boolean(parsed.compiled),
          compileError: parsed.compileError ?? '',
          cases: Array.isArray(parsed.cases) ? parsed.cases : [],
        };
      };

      const executionResult = await executeCodingSubmission(
        problem,
        targetLang,
        code,
        execMode,
        evaluateJavaWithAi
      );

      res.json(executionResult);
    } catch (error) {
      const { status, message } = getReadableApiError(error);
      res.status(status).json({ error: message });
    }
  });

  // Ensure any unknown /api/* route always returns JSON instead of falling through to HTML
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  // Ensure Express middleware errors on /api/* return JSON instead of HTML error pages
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.originalUrl.startsWith('/api')) {
      const { status, message } = getReadableApiError(err);
      res.status(status).json({ error: message });
      return;
    }
    next(err);
  });

  const distPath = path.resolve(__dirname, 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || (process.env.npm_lifecycle_event === 'start' && fs.existsSync(distPath));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart AI Coding Tutor server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
