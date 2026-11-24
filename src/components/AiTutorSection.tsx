import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUpRight, Loader2, RotateCcw, Send, X } from 'lucide-react';
import { postJson } from '../utils/api';
import type { ChatMessage, LanguageId } from '../types';

interface AiTutorSectionProps {
  pendingCodeContext: { language: LanguageId; code: string } | null;
  onClearCodeContext: () => void;
  onQuestionAsked: () => void;
  onOpenInCodeLab: (language: LanguageId, code: string) => void;
}

type TutorFocus = 'General' | 'Python' | 'Java' | 'C++' | 'SQL';

const FOCUS_OPTIONS: TutorFocus[] = ['General', 'Python', 'Java', 'C++', 'SQL'];

const STARTER_PROMPTS = [
  'Explain what a variable is using a real-world example.',
  'How does a Python for loop work?',
  'Why does Java need public static void main?',
  'What does std::cout do in C++?',
  'How do SELECT and WHERE work in SQL?',
];

function renderMessageContent(
  content: string,
  onOpenInCodeLab: (language: LanguageId, code: string) => void
) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {parts.map((part, idx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const langHint = (lines[0] || '').trim().toLowerCase();
          const codeBody = (lines.length > 1 && /^[a-z+#]+$/i.test(langHint)
            ? lines.slice(1)
            : lines
          )
            .join('\n')
            .trim();

          const mappedLang: LanguageId =
            langHint === 'java'
              ? 'java'
              : langHint === 'cpp' || langHint === 'c++'
                ? 'cpp'
                : langHint === 'sql'
                  ? 'sql'
                  : 'python';

          return (
            <div key={idx} className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/80 text-xs text-slate-300">
                <span className="font-mono">{langHint || 'code'}</span>
                <button
                  type="button"
                  onClick={() => onOpenInCodeLab(mappedLang, codeBody)}
                  className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 font-medium cursor-pointer"
                >
                  Open in Code Lab
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-100">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={idx} className="whitespace-pre-wrap">
            {part.trim()}
          </div>
        );
      })}
    </div>
  );
}

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I am your Smart AI Coding Tutor. Ask me anything about Python, Java, or C++—whether you are stuck on a concept, want a simple example, or need help fixing an error.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export function AiTutorSection({
  pendingCodeContext,
  onClearCodeContext,
  onQuestionAsked,
  onOpenInCodeLab,
}: AiTutorSectionProps) {
  const [focus, setFocus] = useState<TutorFocus>('General');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingCodeContext) {
      setFocus(
        pendingCodeContext.language === 'java'
          ? 'Java'
          : pendingCodeContext.language === 'cpp'
            ? 'C++'
            : pendingCodeContext.language === 'sql'
              ? 'SQL'
              : 'Python'
      );
      setInput('Can you explain what this code does and point out any improvements?');
    }
  }, [pendingCodeContext]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textOverride?: string) => {
    const trimmed = (textOverride ?? input).trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);
    onQuestionAsked();

    try {
      const data = await postJson<{ reply?: string }>('/api/tutor/chat', {
        messages: nextMessages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content })),
        language: focus,
        codeContext: pendingCodeContext?.code,
      });

      if (!data.reply) {
        throw new Error('Could not get a response from the AI Tutor.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (pendingCodeContext) {
        onClearCodeContext();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_ASSISTANT_MESSAGE]);
    setError(null);
    onClearCodeContext();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">AI Tutor</h1>
          <p className="text-sm text-slate-600">
            Ask coding questions in plain English and test examples directly in the Code Lab.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {FOCUS_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFocus(option)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  focus === option
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Chat
          </button>
        </div>
      </div>

      {/* Quick Starter Prompts */}
      <div className="flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => sendMessage(prompt)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-sky-500 hover:text-sky-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-xs text-slate-500 mb-1 px-1">
                  {isUser ? 'You' : 'AI Tutor'} · {msg.timestamp}
                </div>
                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-xl px-4 py-3 ${
                    isUser
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  {isUser ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    renderMessageContent(msg.content, onOpenInCodeLab)
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5 text-sm text-slate-600 px-1">
              <Loader2 className="w-4 h-4 animate-spin text-sky-600 mt-0.5" />
              <span>Thinking through your question...</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Attached Code Context Banner */}
        {pendingCodeContext && (
          <div className="px-4 py-2 bg-sky-50 border-t border-sky-200 flex items-center justify-between gap-3 text-xs text-sky-900">
            <span className="truncate">
              Code Lab snippet attached ({pendingCodeContext.language.toUpperCase()},{' '}
              {pendingCodeContext.code.split('\n').length} lines)
            </span>
            <button
              type="button"
              onClick={onClearCodeContext}
              aria-label="Remove attached code snippet"
              className="text-sky-700 hover:text-sky-900 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="border-t border-slate-200 p-3 sm:p-4 flex items-end gap-3"
        >
          <label htmlFor="tutor-input" className="sr-only">
            Ask a coding question
          </label>
          <textarea
            id="tutor-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask a question about Python, Java, C++, SQL, or paste code to debug..."
            className="flex-1 resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 h-10 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
