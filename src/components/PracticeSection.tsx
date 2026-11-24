import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { LANGUAGE_META } from '../data/tutorials';
import type { LanguageId, ProgressState } from '../types';

interface PracticeSectionProps {
  progress: ProgressState;
  onAnswerQuestion: (questionId: string, optionIndex: number) => void;
  onResetQuiz: (questionIds: string[]) => void;
}

type QuizFilter = 'all' | LanguageId;

const FILTER_TABS: Array<{ id: QuizFilter; label: string }> = [
  { id: 'all', label: 'All Topics' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'sql', label: 'SQL' },
];

export function PracticeSection({
  progress,
  onAnswerQuestion,
  onResetQuiz,
}: PracticeSectionProps) {
  const [filter, setFilter] = useState<QuizFilter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredQuestions = useMemo(() => {
    if (filter === 'all') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.language === filter);
  }, [filter]);

  const safeIndex = Math.min(currentIndex, Math.max(filteredQuestions.length - 1, 0));
  const currentQuestion = filteredQuestions[safeIndex];

  const answeredCount = filteredQuestions.filter(
    (q) => progress.quizAnswers[q.id] !== undefined
  ).length;
  const correctCount = filteredQuestions.filter(
    (q) => progress.quizAnswers[q.id] === q.correctIndex
  ).length;

  const handleFilterChange = (nextFilter: QuizFilter) => {
    setFilter(nextFilter);
    setCurrentIndex(0);
  };

  if (!currentQuestion) {
    return null;
  }

  const selectedOption = progress.quizAnswers[currentQuestion.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === currentQuestion.correctIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Practice Quizzes
          </h1>
          <p className="text-sm text-slate-600">
            Test your beginner coding knowledge ·{' '}
            <span className="tabular-nums font-medium text-slate-800">
              {correctCount}/{filteredQuestions.length} correct ({answeredCount} answered)
            </span>
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter quiz by language"
          className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar & Question Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="tabular-nums font-medium">
            Question {safeIndex + 1} of {filteredQuestions.length}
          </span>
          <button
            type="button"
            onClick={() => {
              onResetQuiz(filteredQuestions.map((q) => q.id));
              setCurrentIndex(0);
            }}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Set
          </button>
        </div>

        <div className="flex gap-1.5">
          {filteredQuestions.map((q, idx) => {
            const ans = progress.quizAnswers[q.id];
            let barColor = 'bg-slate-200';
            if (ans !== undefined) {
              barColor = ans === q.correctIndex ? 'bg-emerald-500' : 'bg-red-400';
            }
            const activeRing = idx === safeIndex ? 'ring-2 ring-sky-600 ring-offset-1' : '';
            return (
              <button
                key={q.id}
                type="button"
                aria-label={`Jump to question ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 flex-1 rounded-full transition-colors cursor-pointer ${barColor} ${activeRing}`}
              />
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500">
            {LANGUAGE_META[currentQuestion.language].name} · {currentQuestion.topic}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {currentQuestion.code && (
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
            <code>{currentQuestion.code}</code>
          </pre>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isRightOption = idx === currentQuestion.correctIndex;

            let cardStyle =
              'border-slate-200 bg-white hover:border-sky-400 hover:bg-slate-50 text-slate-800';
            if (hasAnswered) {
              if (isRightOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950';
              } else if (isSelected && !isRightOption) {
                cardStyle = 'border-red-400 bg-red-50 text-red-950';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50/50 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onAnswerQuestion(currentQuestion.id, idx)}
                className={`w-full text-left px-4 py-3.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${cardStyle}`}
              >
                <span className="text-sm font-medium">{option}</span>
                {hasAnswered && isRightOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    Correct
                  </span>
                )}
                {hasAnswered && isSelected && !isRightOption && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 shrink-0">
                    <XCircle className="w-4 h-4" />
                    Incorrect
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback & Explanation */}
        {hasAnswered && (
          <div
            className={`p-4 rounded-lg border text-sm leading-relaxed space-y-1 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="font-semibold flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Correct Answer
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-700" />
                  Not quite — here is why:
                </>
              )}
            </div>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Question Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            disabled={safeIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            type="button"
            disabled={safeIndex >= filteredQuestions.length - 1}
            onClick={() =>
              setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next Question
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
