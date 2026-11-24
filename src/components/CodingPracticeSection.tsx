import { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Play,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import { CODING_PROBLEMS } from '../data/codingProblems';
import { postJson } from '../utils/api';
import type {
  CodingLanguageId,
  CodingProblem,
  CodingTopic,
  DifficultyLevel,
} from '../types';

type TopicFilter = 'All' | CodingTopic;
type DifficultyFilter = 'All' | DifficultyLevel;

type ExecutionVerdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compile Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded';

interface TestCaseExecutionResult {
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

interface CodingExecutionResponse {
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

const SOLVED_STORAGE_KEY = 'smart_ai_coding_tutor_solved_problems_v1';

const LANGUAGES: Array<{ id: CodingLanguageId; label: string; ext: string }> = [
  { id: 'python', label: 'Python', ext: 'main.py' },
  { id: 'java', label: 'Java', ext: 'Main.java' },
  { id: 'cpp', label: 'C++', ext: 'main.cpp' },
];

const TOPICS: TopicFilter[] = [
  'All',
  'Arrays',
  'Strings',
  'Math & Loops',
  'Recursion & DP',
  'Searching & Sorting',
];

const DIFFICULTIES: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard'];

function loadSolvedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(SOLVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function getDifficultyTextColor(level: DifficultyLevel): string {
  if (level === 'Easy') return 'text-emerald-700';
  if (level === 'Medium') return 'text-amber-700';
  return 'text-red-700';
}

export function CodingPracticeSection() {
  const [topicFilter, setTopicFilter] = useState<TopicFilter>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(CODING_PROBLEMS[0].id);
  const [language, setLanguage] = useState<CodingLanguageId>('python');
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [solvedIds, setSolvedIds] = useState<string[]>(loadSolvedIds);
  const [executingMode, setExecutingMode] = useState<'run' | 'submit' | null>(null);
  const [executionResult, setExecutionResult] = useState<CodingExecutionResponse | null>(null);
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const filteredProblems = useMemo(() => {
    return CODING_PROBLEMS.filter((p) => {
      const topicOk = topicFilter === 'All' || p.topic === topicFilter;
      const diffOk = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
      return topicOk && diffOk;
    });
  }, [topicFilter, difficultyFilter]);

  const activeProblem: CodingProblem = useMemo(() => {
    return (
      filteredProblems.find((p) => p.id === selectedProblemId) ??
      filteredProblems[0] ??
      CODING_PROBLEMS[0]
    );
  }, [filteredProblems, selectedProblemId]);

  const draftKey = `${activeProblem.id}:${language}`;
  const currentCode = codeDrafts[draftKey] ?? activeProblem.starterCode[language];
  const lineCount = Math.max(currentCode.split('\n').length, 14);
  const activeLangMeta = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0];

  const handleSelectProblem = (problemId: string) => {
    setSelectedProblemId(problemId);
    setExecutionResult(null);
    setActiveCaseIndex(0);
    setApiError(null);
  };

  const handleCodeChange = (next: string) => {
    setCodeDrafts((prev) => ({
      ...prev,
      [draftKey]: next,
    }));
  };

  const handleResetStarter = () => {
    setCodeDrafts((prev) => {
      const updated = { ...prev };
      delete updated[draftKey];
      return updated;
    });
    setExecutionResult(null);
    setApiError(null);
    editorRef.current?.focus();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failures cleanly
    }
  };

  const executeCode = async (mode: 'run' | 'submit') => {
    if (!currentCode.trim() || executingMode !== null) return;
    setExecutingMode(mode);
    setApiError(null);

    try {
      const result = await postJson<CodingExecutionResponse>('/api/coding-practice/execute', {
        problemId: activeProblem.id,
        language,
        code: currentCode,
        mode,
      });

      setExecutionResult(result);
      const firstFailIdx = result.results.findIndex((r) => !r.passed);
      setActiveCaseIndex(firstFailIdx >= 0 ? firstFailIdx : 0);

      if (mode === 'submit' && result.verdict === 'Accepted') {
        setSolvedIds((prev) => {
          if (prev.includes(activeProblem.id)) return prev;
          const next = [...prev, activeProblem.id];
          try {
            window.localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(next));
          } catch {
            // Ignore localStorage quota errors
          }
          return next;
        });
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Unable to execute code right now.');
    } finally {
      setExecutingMode(null);
    }
  };

  const activeCase = executionResult?.results[activeCaseIndex] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Coding Practice
          </h1>
          <p className="text-sm text-slate-600">
            Solve real programming challenges in Python, Java, or C++ ·{' '}
            <span className="tabular-nums font-medium text-slate-800">
              {solvedIds.length}/{CODING_PROBLEMS.length} solved
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Topic Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="coding-topic-filter" className="text-xs font-medium text-slate-600">
              Topic
            </label>
            <select
              id="coding-topic-filter"
              value={topicFilter}
              onChange={(e) => {
                const nextTopic = e.target.value as TopicFilter;
                setTopicFilter(nextTopic);
                setExecutionResult(null);
                setApiError(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div
            role="tablist"
            aria-label="Filter problems by difficulty"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
          >
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                role="tab"
                aria-selected={difficultyFilter === diff}
                onClick={() => {
                  setDifficultyFilter(diff);
                  setExecutionResult(null);
                  setApiError(null);
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficultyFilter === diff
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Panel Workspace: Left = Questions + Statement | Right = Code Editor + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT PANEL: Coding Questions & Problem Statement */}
        <section
          aria-label="Coding Questions"
          className="lg:col-span-5 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden"
        >
          {/* Question List */}
          <div className="border-b border-slate-200">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Problems ({filteredProblems.length})
              </span>
              <span className="text-xs text-slate-500">Select a question to solve</span>
            </div>

            {filteredProblems.length === 0 ? (
              <div className="p-5 text-sm text-slate-600">
                No questions match the selected topic and difficulty. Try changing the filters above.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {filteredProblems.map((problem) => {
                  const isActive = problem.id === activeProblem.id;
                  const isSolved = solvedIds.includes(problem.id);
                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => handleSelectProblem(problem.id)}
                      className={`w-full text-left px-4 py-3 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isActive ? 'bg-sky-50/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0">
                            {problem.number}.
                          </span>
                          <span
                            className={`text-sm font-semibold truncate ${
                              isActive ? 'text-sky-900' : 'text-slate-900'
                            }`}
                          >
                            {problem.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pl-6">
                          <span>{problem.topic}</span>
                          <span aria-hidden="true">·</span>
                          <span className={`font-semibold ${getDifficultyTextColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>

                      {isSolved && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          Solved
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Problem Statement */}
          <div className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono tabular-nums">Problem {activeProblem.number}</span>
                <span aria-hidden="true">·</span>
                <span>{activeProblem.topic}</span>
                <span aria-hidden="true">·</span>
                <span className={`font-semibold ${getDifficultyTextColor(activeProblem.difficulty)}`}>
                  {activeProblem.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{activeProblem.title}</h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{activeProblem.statement}</p>

            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Input Format</h3>
                <p className="text-slate-700 leading-relaxed">{activeProblem.inputFormat}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Output Format</h3>
                <p className="text-slate-700 leading-relaxed">{activeProblem.outputFormat}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-slate-900">Constraints</h3>
                <p className="font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  {activeProblem.constraints}
                </p>
              </div>
            </div>

            {/* Sample Input & Sample Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-800">Sample Input</div>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  {activeProblem.sampleInput}
                </pre>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-800">Sample Output</div>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  {activeProblem.sampleOutput}
                </pre>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Example Note: </span>
              {activeProblem.sampleExplanation}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Code Editor + Output & Test Results */}
        <section
          aria-label="Code Editor and Test Results"
          className="lg:col-span-7 flex flex-col gap-5"
        >
          {/* Editor Card */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col min-h-[420px]">
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  role="tablist"
                  aria-label="Select programming language"
                  className="inline-flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      role="tab"
                      aria-selected={language === lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setExecutionResult(null);
                        setApiError(null);
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        language === lang.id
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                  {activeLangMeta.ext}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetStarter}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
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
              </div>
            </div>

            {/* Line-Numbered Editor */}
            <div className="flex flex-1 overflow-auto max-h-[380px]">
              <div
                aria-hidden="true"
                className="py-4 px-3 text-right font-mono text-xs sm:text-sm text-slate-500 select-none bg-slate-900 border-r border-slate-800 tabular-nums leading-6"
              >
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              <label htmlFor="coding-practice-editor" className="sr-only">
                Solution code editor
              </label>
              <textarea
                ref={editorRef}
                id="coding-practice-editor"
                value={currentCode}
                spellCheck={false}
                placeholder="Write your solution code here..."
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
                className="flex-1 w-full bg-slate-900 text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-sm p-4 leading-6 resize-none focus:outline-none min-h-[320px]"
              />
            </div>

            {/* Run & Submit Footer Bar */}
            <div className="px-4 py-3 bg-slate-800/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Reads from standard input (stdin) and compares stdout against test cases.
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => executeCode('run')}
                  disabled={executingMode !== null || !currentCode.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {executingMode === 'run' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Code
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => executeCode('submit')}
                  disabled={executingMode !== null || !currentCode.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {executingMode === 'submit' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output & Test Case Results Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Output &amp; Test Results</h3>

              {executionResult && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 tabular-nums">
                    {executionResult.passedCount}/{executionResult.totalCount} test cases passed
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                      executionResult.verdict === 'Accepted'
                        ? 'text-emerald-700'
                        : executionResult.verdict === 'Time Limit Exceeded'
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    {executionResult.verdict === 'Accepted' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : executionResult.verdict === 'Time Limit Exceeded' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {executionResult.verdict}
                  </span>
                </div>
              )}
            </div>

            {apiError ? (
              <div
                role="alert"
                className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            ) : !executionResult ? (
              <div className="py-6 text-center text-sm text-slate-500 space-y-1">
                <p className="font-medium text-slate-700">
                  Write your solution above and click Run Code or Submit Code.
                </p>
                <p className="text-xs text-slate-500">
                  Run Code tests sample inputs; Submit Code evaluates all sample and hidden test cases.
                </p>
              </div>
            ) : executionResult.compileError ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-red-700">Compilation Error</div>
                <pre className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {executionResult.compileError}
                </pre>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Verdict Summary Banner */}
                <div
                  className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 text-sm ${
                    executionResult.verdict === 'Accepted'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {executionResult.verdict === 'Accepted' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>
                      {executionResult.verdict === 'Accepted'
                        ? executionResult.mode === 'submit'
                          ? 'Accepted — All test cases passed!'
                          : 'Accepted on sample test cases — Ready to submit!'
                        : `${executionResult.verdict} — ${executionResult.passedCount} of ${executionResult.totalCount} test cases passed`}
                    </span>
                  </div>
                </div>

                {/* Test Case Tabs */}
                {executionResult.results.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {executionResult.results.map((tc, idx) => (
                        <button
                          key={tc.id}
                          type="button"
                          onClick={() => setActiveCaseIndex(idx)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                            idx === activeCaseIndex
                              ? 'border-sky-600 bg-sky-50 text-sky-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {tc.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                          )}
                          <span>{tc.label}</span>
                        </button>
                      ))}
                    </div>

                    {activeCase && (
                      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{activeCase.label}</span>
                          <span
                            className={`font-semibold ${
                              activeCase.passed ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {activeCase.status}
                          </span>
                        </div>

                        {activeCase.isHidden ? (
                          <p className="text-xs text-slate-600">
                            Hidden test case details are kept private. Status: {activeCase.status}.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Input</div>
                              <pre className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                                {activeCase.input || '(empty)'}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Expected Output</div>
                              <pre className="p-2.5 rounded bg-white border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                                {activeCase.expectedOutput || '(empty)'}
                              </pre>
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-slate-600">Your Output</div>
                              <pre
                                className={`p-2.5 rounded border font-mono text-xs overflow-x-auto ${
                                  activeCase.passed
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                    : 'bg-red-50 border-red-200 text-red-950'
                                }`}
                              >
                                {activeCase.actualOutput || '(no output)'}
                              </pre>
                            </div>
                          </div>
                        )}

                        {activeCase.stderr && (
                          <div className="space-y-1">
                            <div className="text-xs font-medium text-red-700">Runtime Error / stderr</div>
                            <pre className="p-2.5 rounded bg-red-50 border border-red-200 font-mono text-xs text-red-900 overflow-x-auto whitespace-pre-wrap">
                              {activeCase.stderr}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
