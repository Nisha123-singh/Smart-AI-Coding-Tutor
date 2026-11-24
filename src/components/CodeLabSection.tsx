import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardPaste,
  Copy,
  Lightbulb,
  Loader2,
  MessageSquare,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { LANGUAGE_META } from '../data/tutorials';
import { postJson } from '../utils/api';
import type { LanguageId } from '../types';

interface CodeLabSectionProps {
  initialLanguage: LanguageId;
  externalCode: { language: LanguageId; code: string } | null;
  onConsumeExternalCode: () => void;
  onCodeRun: () => void;
  onAskTutorWithCode: (language: LanguageId, code: string) => void;
}

interface LabResult {
  stdout: string;
  hasError: boolean;
  explanation: string;
  lineByLine: Array<{ lines: string; detail: string }>;
  mistakes: Array<{ issue: string; fix: string }>;
  theoryPoints: string[];
}

type ConsoleTab = 'output' | 'mistakes' | 'explanation' | 'theory';

const LANGUAGES: LanguageId[] = ['python', 'java', 'cpp', 'sql'];

export function CodeLabSection({
  initialLanguage,
  externalCode,
  onConsumeExternalCode,
  onCodeRun,
  onAskTutorWithCode,
}: CodeLabSectionProps) {
  const [language, setLanguage] = useState<LanguageId>(initialLanguage);
  const [codeByLang, setCodeByLang] = useState<Record<LanguageId, string>>({
    python: LANGUAGE_META.python.starterCode,
    java: LANGUAGE_META.java.starterCode,
    cpp: LANGUAGE_META.cpp.starterCode,
    sql: LANGUAGE_META.sql.starterCode,
  });
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<LabResult | null>(null);
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('output');
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pasteHint, setPasteHint] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (externalCode) {
      setLanguage(externalCode.language);
      setCodeByLang((prev) => ({
        ...prev,
        [externalCode.language]: externalCode.code,
      }));
      setResult(null);
      setApiError(null);
      setConsoleTab('output');
      onConsumeExternalCode();
    }
  }, [externalCode, onConsumeExternalCode]);

  const currentCode = codeByLang[language];
  const lineCount = Math.max(currentCode.split('\n').length, 10);

  const handleCodeChange = (nextCode: string) => {
    setCodeByLang((prev) => ({
      ...prev,
      [language]: nextCode,
    }));
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setPasteHint('Select the code and press Ctrl+C / Cmd+C to copy.');
      setTimeout(() => setPasteHint(null), 2600);
    }
  };

  const handlePasteCode = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.trim()) {
        handleCodeChange(clipboardText);
        setResult(null);
        setApiError(null);
        setPasteHint('Code pasted from clipboard.');
        setTimeout(() => setPasteHint(null), 2000);
      } else {
        editorRef.current?.focus();
        setPasteHint('Clipboard is empty. You can also paste directly with Ctrl+V / Cmd+V.');
        setTimeout(() => setPasteHint(null), 2600);
      }
    } catch {
      editorRef.current?.focus();
      setPasteHint('Press Ctrl+V / Cmd+V inside the editor to paste your code.');
      setTimeout(() => setPasteHint(null), 3000);
    }
  };

  const handleClearEditor = () => {
    handleCodeChange('');
    setResult(null);
    setApiError(null);
    editorRef.current?.focus();
  };

  const handleResetStarter = () => {
    handleCodeChange(LANGUAGE_META[language].starterCode);
    setResult(null);
    setApiError(null);
  };

  const handleRunCode = async () => {
    if (!currentCode.trim() || running) return;
    setRunning(true);
    setApiError(null);

    try {
      const data = await postJson<Partial<LabResult>>('/api/lab/run', {
        language,
        code: currentCode,
      });

      const nextResult: LabResult = {
        stdout: data.stdout ?? '',
        hasError: Boolean(data.hasError),
        explanation: data.explanation ?? '',
        lineByLine: Array.isArray(data.lineByLine) ? data.lineByLine : [],
        mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
        theoryPoints: Array.isArray(data.theoryPoints) ? data.theoryPoints : [],
      };

      setResult(nextResult);
      setConsoleTab('output');
      onCodeRun();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to run code right now.';
      setApiError(msg);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Code Lab
          </h1>
          <p className="text-sm text-slate-600">
            Write or paste your Python, Java, C++, or SQL code to check output, spot mistakes, and
            read line-by-line explanations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Select editor language"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                role="tab"
                aria-selected={language === lang}
                onClick={() => {
                  setLanguage(lang);
                  setResult(null);
                  setApiError(null);
                }}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === lang
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {LANGUAGE_META[lang].name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetStarter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            Starter
          </button>

          <button
            type="button"
            onClick={() => onAskTutorWithCode(language, currentCode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            Ask AI Tutor
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={running || !currentCode.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run &amp; Explain
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split Workspace: Editor + Output / Mistakes / Explanation / Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Code Editor */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col min-h-[460px]">
          <div className="px-4 py-2.5 bg-slate-800/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <span className="font-mono">{LANGUAGE_META[language].fileExtension}</span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Paste
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClearEditor}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {pasteHint && (
            <div className="px-4 py-1.5 bg-sky-950 text-sky-200 text-xs border-b border-sky-900">
              {pasteHint}
            </div>
          )}

          <div className="flex flex-1 overflow-auto">
            <div
              aria-hidden="true"
              className="py-4 px-3 text-right font-mono text-xs sm:text-sm text-slate-500 select-none bg-slate-900 border-r border-slate-800 tabular-nums leading-6"
            >
              {Array.from({ length: lineCount }, (_, idx) => (
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>

            <label htmlFor="code-lab-editor" className="sr-only">
              Code editor
            </label>
            <textarea
              ref={editorRef}
              id="code-lab-editor"
              value={currentCode}
              spellCheck={false}
              placeholder="Write or paste your code here (Ctrl+V / Cmd+V)..."
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const updated =
                    currentCode.substring(0, start) + '    ' + currentCode.substring(end);
                  handleCodeChange(updated);
                  requestAnimationFrame(() => {
                    target.selectionStart = start + 4;
                    target.selectionEnd = start + 4;
                  });
                }
              }}
              className="flex-1 w-full bg-slate-900 text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-sm p-4 leading-6 resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Output, Mistakes, Explanation & Theory Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[460px]">
          <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Code analysis views"
              className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                role="tab"
                aria-selected={consoleTab === 'output'}
                onClick={() => setConsoleTab('output')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consoleTab === 'output'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Output
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={consoleTab === 'mistakes'}
                onClick={() => setConsoleTab('mistakes')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consoleTab === 'mistakes'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mistakes{result ? ` (${result.mistakes.length})` : ''}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={consoleTab === 'explanation'}
                onClick={() => setConsoleTab('explanation')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consoleTab === 'explanation'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explanation
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={consoleTab === 'theory'}
                onClick={() => setConsoleTab('theory')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  consoleTab === 'theory'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Theory
              </button>
            </div>

            {result && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  result.hasError ? 'text-red-700' : 'text-emerald-700'
                }`}
              >
                {result.hasError ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Error Found
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ran Cleanly
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between gap-5 overflow-y-auto">
            {apiError ? (
              <div
                role="alert"
                className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 space-y-1"
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Request Failed
                </div>
                <p>{apiError}</p>
              </div>
            ) : !result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
                <Play className="w-8 h-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">
                  Paste or write code, then click Run &amp; Explain
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  You will get console output, detected mistakes with fixes, a line-by-line
                  explanation, and key theory points.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {consoleTab === 'output' && (
                  <>
                    <pre
                      className={`p-4 rounded-lg font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-x-auto border ${
                        result.hasError
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-slate-900 border-slate-800 text-slate-100'
                      }`}
                    >
                      {result.stdout || '(No console output printed)'}
                    </pre>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">Summary</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{result.explanation}</p>
                    </div>
                  </>
                )}

                {consoleTab === 'mistakes' && (
                  <div className="space-y-3">
                    {result.mistakes.length === 0 ? (
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>
                          No syntax errors or common beginner mistakes detected in this code.
                        </span>
                      </div>
                    ) : (
                      result.mistakes.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1.5"
                        >
                          <div className="flex items-start gap-2 text-sm font-semibold text-amber-950">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <span>{item.issue}</span>
                          </div>
                          <p className="text-sm text-slate-700 pl-6 leading-relaxed">
                            <span className="font-semibold text-slate-900">Fix: </span>
                            {item.fix}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {consoleTab === 'explanation' && (
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                    {result.lineByLine.length === 0 ? (
                      <div className="p-4 text-sm text-slate-600">{result.explanation}</div>
                    ) : (
                      result.lineByLine.map((step, idx) => (
                        <div key={idx} className="p-3.5 bg-white space-y-1">
                          <div className="font-mono text-xs font-semibold text-sky-700">
                            {step.lines}
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{step.detail}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {consoleTab === 'theory' && (
                  <div className="p-4 rounded-lg bg-sky-50/60 border border-sky-200 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Lightbulb className="w-4 h-4 text-sky-600" />
                      <span>Theory Points in Your Code</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                      {result.theoryPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
              Tip: Use Paste or Ctrl+V / Cmd+V to test your own code from class or tutorials.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
