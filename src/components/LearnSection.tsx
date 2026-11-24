import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Lightbulb,
  Play,
  XCircle,
} from 'lucide-react';
import { LANGUAGE_META, TUTORIAL_LESSONS } from '../data/tutorials';
import type { LanguageId, ProgressState } from '../types';

interface LearnSectionProps {
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  progress: ProgressState;
  onToggleComplete: (lessonId: string) => void;
  onOpenInCodeLab: (language: LanguageId, code: string) => void;
}

type LessonTab = 'overview' | 'explanation' | 'mistakes';

const LANGUAGES: LanguageId[] = ['python', 'java', 'cpp', 'sql'];

export function LearnSection({
  selectedLanguage,
  onSelectLanguage,
  progress,
  onToggleComplete,
  onOpenInCodeLab,
}: LearnSectionProps) {
  const lessonsForLang = TUTORIAL_LESSONS.filter((l) => l.language === selectedLanguage);
  const [activeLessonId, setActiveLessonId] = useState<string>(lessonsForLang[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<LessonTab>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const first = TUTORIAL_LESSONS.find((l) => l.language === selectedLanguage);
    if (first && !lessonsForLang.some((l) => l.id === activeLessonId)) {
      setActiveLessonId(first.id);
    }
  }, [selectedLanguage, lessonsForLang, activeLessonId]);

  const activeLesson =
    lessonsForLang.find((l) => l.id === activeLessonId) ?? lessonsForLang[0];

  if (!activeLesson) {
    return null;
  }

  const isCompleted = progress.completedLessons.includes(activeLesson.id);
  const completedInTrack = lessonsForLang.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeLesson.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission denial
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & Language Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Learn Coding
          </h1>
          <p className="text-sm text-slate-600">
            Step-by-step beginner lessons for {LANGUAGE_META[selectedLanguage].name} ·{' '}
            <span className="tabular-nums font-medium text-slate-800">
              {completedInTrack}/{lessonsForLang.length} completed
            </span>
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Choose programming language"
          className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start"
        >
          {LANGUAGES.map((lang) => {
            const active = lang === selectedLanguage;
            return (
              <button
                key={lang}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectLanguage(lang)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {LANGUAGE_META[lang].name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Lesson Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Lesson List */}
        <aside className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 px-1 pb-1">
            {LANGUAGE_META[selectedLanguage].name} Curriculum
          </h2>
          {lessonsForLang.map((lesson) => {
            const isSelected = lesson.id === activeLesson.id;
            const done = progress.completedLessons.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonId(lesson.id)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-sky-600 ring-1 ring-sky-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-xs text-slate-500 tabular-nums">
                    Lesson {lesson.number} · {lesson.duration}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 leading-snug">
                    {lesson.title}
                  </div>
                </div>
                {done && (
                  <CheckCircle2
                    aria-label="Completed"
                    className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Canvas: Active Lesson Content */}
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-500">
                {LANGUAGE_META[selectedLanguage].name} · Lesson {activeLesson.number} ·{' '}
                {activeLesson.duration}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeLesson.title}
              </h2>
              <p className="text-sm text-slate-600">{activeLesson.summary}</p>
            </div>

            <button
              type="button"
              onClick={() => onToggleComplete(activeLesson.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>

          {/* Interactive Lesson Study Tabs */}
          <div
            role="tablist"
            aria-label="Lesson study views"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              Theory &amp; Example
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'explanation'}
              onClick={() => setActiveTab('explanation')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'explanation'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4 text-sky-600" />
              Code Explanation
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'mistakes'}
              onClick={() => setActiveTab('mistakes')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'mistakes'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Common Mistakes ({activeLesson.commonMistakes.length})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                {activeLesson.explanation.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Theory Points */}
              <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  <span>Theory Points</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {activeLesson.theoryPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* Quick Syntax Rules */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2.5">
                <h3 className="text-sm font-semibold text-slate-900">Quick Syntax Checklist</h3>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {activeLesson.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Walk through the example below step by step to see how every line works.
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {activeLesson.codeExplanation.map((step, index) => (
                  <div key={index} className="p-4 bg-white flex flex-col sm:flex-row gap-2 sm:gap-5">
                    <span className="font-mono text-xs font-semibold text-sky-700 shrink-0 sm:w-24 pt-0.5 tabular-nums">
                      {step.lines}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">{step.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-600">
                Spot these frequent beginner mistakes visually before they slow you down.
              </p>
              {activeLesson.commonMistakes.map((mistake, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/50"
                >
                  <h3 className="text-sm font-bold text-slate-900">{mistake.title}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                        <XCircle className="w-3.5 h-3.5" />
                        Avoid This Mistake
                      </div>
                      <pre className="bg-red-50 border border-red-200 text-red-950 rounded-lg p-3.5 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{mistake.wrongCode}</code>
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Write This Instead
                      </div>
                      <pre className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg p-3.5 text-xs font-mono overflow-x-auto leading-relaxed">
                        <code>{mistake.rightCode}</code>
                      </pre>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">{mistake.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Always-Accessible Example Code Block with Copy & Try in Code Lab */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">
                Example Code ({LANGUAGE_META[selectedLanguage].fileExtension})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInCodeLab(selectedLanguage, activeLesson.code)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  Try in Code Lab
                </button>
              </div>
            </div>

            <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 sm:p-5 overflow-x-auto text-sm font-mono leading-relaxed">
              <code>{activeLesson.code}</code>
            </pre>
          </div>
        </article>
      </div>
    </div>
  );
}
