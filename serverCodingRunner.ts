import { spawn } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import type { CodingLanguageId, CodingProblem, CodingTestCase } from './src/types.ts';

export type ExecutionVerdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compile Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded';

export interface TestCaseExecutionResult {
  id: string;
  label: string;
  isHidden: boolean;
  passed: boolean;
  input: string | null;
  expectedOutput: string | null;
  actualOutput: string;
  stderr: string;
  status: 'Passed' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
}

export interface CodingExecutionResponse {
  verdict: ExecutionVerdict;
  mode: 'run' | 'submit';
  language: CodingLanguageId;
  compileError: string | null;
  stdout: string;
  stderr: string;
  passedCount: number;
  totalCount: number;
  results: TestCaseExecutionResult[];
}

export interface JavaAiOutput {
  compiled: boolean;
  compileError: string;
  cases: Array<{
    stdout: string;
    stderr: string;
    runtimeError: boolean;
  }>;
}

const MAX_OUTPUT_BYTES = 64 * 1024;
const COMPILE_TIMEOUT_MS = 8000;
const RUN_TIMEOUT_MS = 3000;

export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/g, ''))
    .join('\n')
    .trim();
}

interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

function runCommandProcess(
  command: string,
  args: string[],
  cwd: string,
  stdinInput: string,
  timeoutMs: number
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdout.length < MAX_OUTPUT_BYTES) {
        stdout += chunk.toString('utf8');
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderr.length < MAX_OUTPUT_BYTES) {
        stderr += chunk.toString('utf8');
      }
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout: stdout.slice(0, MAX_OUTPUT_BYTES),
        stderr: stderr.slice(0, MAX_OUTPUT_BYTES),
        exitCode: code,
        timedOut,
      });
    });

    if (stdinInput) {
      child.stdin.write(stdinInput.endsWith('\n') ? stdinInput : `${stdinInput}\n`);
    }
    child.stdin.end();
  });
}

async function hasCommand(cmd: string): Promise<boolean> {
  try {
    const res = await runCommandProcess('which', [cmd], os.tmpdir(), '', 2000);
    return res.exitCode === 0 && res.stdout.trim().length > 0;
  } catch {
    return false;
  }
}

function buildTestCaseResult(
  tc: CodingTestCase,
  index: number,
  actualStdout: string,
  stderr: string,
  hasRuntimeError: boolean,
  timedOut: boolean,
  isSubmit: boolean
): TestCaseExecutionResult {
  const isHidden = isSubmit && !tc.isSample;
  const normalizedActual = normalizeOutput(actualStdout);
  const normalizedExpected = normalizeOutput(tc.expectedOutput);

  let status: TestCaseExecutionResult['status'];
  let passed = false;

  if (timedOut) {
    status = 'Time Limit Exceeded';
  } else if (hasRuntimeError) {
    status = 'Runtime Error';
  } else if (normalizedActual === normalizedExpected) {
    status = 'Passed';
    passed = true;
  } else {
    status = 'Wrong Answer';
  }

  return {
    id: tc.id,
    label: isHidden ? `Hidden Case ${index + 1}` : `Sample Case ${index + 1}`,
    isHidden,
    passed,
    input: isHidden ? null : tc.input,
    expectedOutput: isHidden ? null : tc.expectedOutput,
    actualOutput: isHidden && !passed ? '(hidden)' : actualStdout.trimEnd(),
    stderr: stderr.trim(),
    status,
  };
}

function computeVerdict(results: TestCaseExecutionResult[]): ExecutionVerdict {
  if (results.some((r) => r.status === 'Time Limit Exceeded')) {
    return 'Time Limit Exceeded';
  }
  if (results.some((r) => r.status === 'Runtime Error')) {
    return 'Runtime Error';
  }
  if (results.length > 0 && results.every((r) => r.passed)) {
    return 'Accepted';
  }
  return 'Wrong Answer';
}

export async function executeCodingSubmission(
  problem: CodingProblem,
  language: CodingLanguageId,
  code: string,
  mode: 'run' | 'submit',
  evaluateJavaWithAi: (code: string, cases: CodingTestCase[]) => Promise<JavaAiOutput>
): Promise<CodingExecutionResponse> {
  const selectedCases =
    mode === 'run'
      ? problem.testCases.filter((tc) => tc.isSample)
      : problem.testCases;
  const casesToRun = selectedCases.length > 0 ? selectedCases : problem.testCases.slice(0, 1);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'coding-practice-'));

  try {
    if (language === 'python') {
      const filePath = path.join(tempDir, 'main.py');
      await fs.writeFile(filePath, code, 'utf8');

      // Quick syntax compile check first
      const syntaxCheck = await runCommandProcess(
        'python3',
        ['-m', 'py_compile', filePath],
        tempDir,
        '',
        COMPILE_TIMEOUT_MS
      );
      if (syntaxCheck.exitCode !== 0) {
        return {
          verdict: 'Compile Error',
          mode,
          language,
          compileError: syntaxCheck.stderr.trim() || 'Python syntax error.',
          stdout: '',
          stderr: syntaxCheck.stderr.trim(),
          passedCount: 0,
          totalCount: casesToRun.length,
          results: [],
        };
      }

      const results: TestCaseExecutionResult[] = [];
      for (let i = 0; i < casesToRun.length; i++) {
        const tc = casesToRun[i];
        const runRes = await runCommandProcess(
          'python3',
          ['-u', filePath],
          tempDir,
          tc.input,
          RUN_TIMEOUT_MS
        );
        results.push(
          buildTestCaseResult(
            tc,
            i,
            runRes.stdout,
            runRes.stderr,
            runRes.exitCode !== 0 && !runRes.timedOut,
            runRes.timedOut,
            mode === 'submit'
          )
        );
      }

      const first = results[0];
      return {
        verdict: computeVerdict(results),
        mode,
        language,
        compileError: null,
        stdout: first?.isHidden ? '' : first?.actualOutput ?? '',
        stderr: results.find((r) => r.stderr)?.stderr ?? '',
        passedCount: results.filter((r) => r.passed).length,
        totalCount: results.length,
        results,
      };
    }

    if (language === 'cpp') {
      const srcPath = path.join(tempDir, 'main.cpp');
      const binPath = path.join(tempDir, 'main');
      await fs.writeFile(srcPath, code, 'utf8');

      const compileRes = await runCommandProcess(
        'g++',
        ['-std=c++17', '-O2', srcPath, '-o', binPath],
        tempDir,
        '',
        COMPILE_TIMEOUT_MS
      );
      if (compileRes.timedOut || compileRes.exitCode !== 0) {
        return {
          verdict: 'Compile Error',
          mode,
          language,
          compileError:
            compileRes.stderr.trim() ||
            (compileRes.timedOut ? 'C++ compilation timed out.' : 'C++ compilation failed.'),
          stdout: '',
          stderr: compileRes.stderr.trim(),
          passedCount: 0,
          totalCount: casesToRun.length,
          results: [],
        };
      }

      const results: TestCaseExecutionResult[] = [];
      for (let i = 0; i < casesToRun.length; i++) {
        const tc = casesToRun[i];
        const runRes = await runCommandProcess(binPath, [], tempDir, tc.input, RUN_TIMEOUT_MS);
        results.push(
          buildTestCaseResult(
            tc,
            i,
            runRes.stdout,
            runRes.stderr,
            runRes.exitCode !== 0 && !runRes.timedOut,
            runRes.timedOut,
            mode === 'submit'
          )
        );
      }

      const first = results[0];
      return {
        verdict: computeVerdict(results),
        mode,
        language,
        compileError: null,
        stdout: first?.isHidden ? '' : first?.actualOutput ?? '',
        stderr: results.find((r) => r.stderr)?.stderr ?? '',
        passedCount: results.filter((r) => r.passed).length,
        totalCount: results.length,
        results,
      };
    }

    // Java: run natively with javac/java if installed, otherwise evaluate via Gemini runtime evaluator
    const hasJavac = (await hasCommand('javac')) && (await hasCommand('java'));
    if (hasJavac) {
      const classMatch = code.match(/public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)/);
      const className = classMatch?.[1] || 'Main';
      const srcPath = path.join(tempDir, `${className}.java`);
      await fs.writeFile(srcPath, code, 'utf8');

      const compileRes = await runCommandProcess(
        'javac',
        [srcPath],
        tempDir,
        '',
        COMPILE_TIMEOUT_MS
      );
      if (compileRes.timedOut || compileRes.exitCode !== 0) {
        return {
          verdict: 'Compile Error',
          mode,
          language,
          compileError: compileRes.stderr.trim() || 'Java compilation failed.',
          stdout: '',
          stderr: compileRes.stderr.trim(),
          passedCount: 0,
          totalCount: casesToRun.length,
          results: [],
        };
      }

      const results: TestCaseExecutionResult[] = [];
      for (let i = 0; i < casesToRun.length; i++) {
        const tc = casesToRun[i];
        const runRes = await runCommandProcess(
          'java',
          ['-cp', tempDir, className],
          tempDir,
          tc.input,
          RUN_TIMEOUT_MS
        );
        results.push(
          buildTestCaseResult(
            tc,
            i,
            runRes.stdout,
            runRes.stderr,
            runRes.exitCode !== 0 && !runRes.timedOut,
            runRes.timedOut,
            mode === 'submit'
          )
        );
      }

      const first = results[0];
      return {
        verdict: computeVerdict(results),
        mode,
        language,
        compileError: null,
        stdout: first?.isHidden ? '' : first?.actualOutput ?? '',
        stderr: results.find((r) => r.stderr)?.stderr ?? '',
        passedCount: results.filter((r) => r.passed).length,
        totalCount: results.length,
        results,
      };
    }

    const aiJava = await evaluateJavaWithAi(code, casesToRun);
    if (!aiJava.compiled) {
      return {
        verdict: 'Compile Error',
        mode,
        language,
        compileError: aiJava.compileError || 'Java compilation failed.',
        stdout: '',
        stderr: aiJava.compileError || '',
        passedCount: 0,
        totalCount: casesToRun.length,
        results: [],
      };
    }

    const results = casesToRun.map((tc, i) => {
      const item = aiJava.cases[i] ?? { stdout: '', stderr: '', runtimeError: false };
      return buildTestCaseResult(
        tc,
        i,
        item.stdout ?? '',
        item.stderr ?? '',
        Boolean(item.runtimeError),
        false,
        mode === 'submit'
      );
    });

    const first = results[0];
    return {
      verdict: computeVerdict(results),
      mode,
      language,
      compileError: null,
      stdout: first?.isHidden ? '' : first?.actualOutput ?? '',
      stderr: results.find((r) => r.stderr)?.stderr ?? '',
      passedCount: results.filter((r) => r.passed).length,
      totalCount: results.length,
      results,
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
