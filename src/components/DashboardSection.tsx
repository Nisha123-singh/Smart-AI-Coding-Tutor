import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LogIn,
  LogOut,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { LANGUAGE_META, TUTORIAL_LESSONS } from '../data/tutorials';
import type { LanguageId, ProgressState, SectionId } from '../types';

interface DashboardSectionProps {
  progress: ProgressState;
  onNavigate: (section: SectionId) => void;
  onContinueTrack: (language: LanguageId) => void;
  onResetProgress: () => void;
}

const LANGUAGES: LanguageId[] = ['python', 'java', 'cpp', 'sql'];

export function DashboardSection({
  progress,
  onNavigate,
  onContinueTrack,
  onResetProgress,
}: DashboardSectionProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const { user, authBusy, signInWithGoogle, signOutUser } = useAuth();

  const totalLessons = TUTORIAL_LESSONS.length;
  const completedLessonsCount = progress.completedLessons.length;
  const lessonCompletionPct = Math.round((completedLessonsCount / totalLessons) * 100);

  const totalQuizQuestions = QUIZ_QUESTIONS.length;
  const answeredQuizIds = Object.keys(progress.quizAnswers);
  const correctQuizCount = QUIZ_QUESTIONS.filter(
    (q) => progress.quizAnswers[q.id] === q.correctIndex
  ).length;
  const quizAccuracyPct =
    answeredQuizIds.length > 0
      ? Math.round((correctQuizCount / answeredQuizIds.length) * 100)
      : 0;

  const nextLesson =
    TUTORIAL_LESSONS.find((l) => !progress.completedLessons.includes(l.id)) ??
    TUTORIAL_LESSONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Learning Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Track your lessons, quiz accuracy, Code Lab experiments, and AI Tutor questions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progress
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Firebase Account & Cloud Sync Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-slate-900">
                {user
                  ? `Signed in as ${user.displayName || user.email}`
                  : 'Guest Mode (Local Browser Storage)'}
              </div>
              <p className="text-xs text-slate-600">
                {user
                  ? `${user.email} · Your progress automatically syncs to Firebase.`
                  : 'Sign in with your Google account to save and sync learning progress across devices.'}
              </p>
            </div>
          </div>

          {user ? (
            <button
              type="button"
              disabled={authBusy}
              onClick={() => void signOutUser()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              disabled={authBusy}
              onClick={() => void signInWithGoogle()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Google
            </button>
          )}
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
          <div className="text-xs font-medium text-slate-500">Lessons Completed</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {completedLessonsCount}/{totalLessons}
          </div>
          <div className="text-xs text-slate-600 tabular-nums">
            {lessonCompletionPct}% of beginner curriculum
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
          <div className="text-xs font-medium text-slate-500">Quiz Accuracy</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{quizAccuracyPct}%</div>
          <div className="text-xs text-slate-600 tabular-nums">
            {correctQuizCount} correct out of {answeredQuizIds.length}/{totalQuizQuestions} answered
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
          <div className="text-xs font-medium text-slate-500">Code Lab Runs</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{progress.codeRuns}</div>
          <div className="text-xs text-slate-600">Programs tested in editor</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
          <div className="text-xs font-medium text-slate-500">AI Tutor Questions</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">
            {progress.tutorQuestions}
          </div>
          <div className="text-xs text-slate-600">Questions asked to mentor</div>
        </div>
      </div>

      {/* Recommended Next Step */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-sky-700">Recommended Next Step</div>
          <h2 className="text-lg font-bold text-slate-900">
            {completedLessonsCount === totalLessons
              ? 'You finished all beginner lessons! Try a Practice Quiz or experiment in Code Lab.'
              : `${LANGUAGE_META[nextLesson.language].name} Lesson ${nextLesson.number}: ${nextLesson.title}`}
          </h2>
          <p className="text-sm text-slate-600">{nextLesson.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onContinueTrack(nextLesson.language)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4" />
            {completedLessonsCount === totalLessons ? 'Review Lessons' : 'Continue Lesson'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            Open Practice
          </button>
        </div>
      </div>

      {/* Per-Language Progress Breakdown */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Progress by Language</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LANGUAGES.map((lang) => {
            const meta = LANGUAGE_META[lang];
            const langLessons = TUTORIAL_LESSONS.filter((l) => l.language === lang);
            const langDone = langLessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const lessonPct = Math.round((langDone / langLessons.length) * 100);

            const langQuizzes = QUIZ_QUESTIONS.filter((q) => q.language === lang);
            const langQuizCorrect = langQuizzes.filter(
              (q) => progress.quizAnswers[q.id] === q.correctIndex
            ).length;

            return (
              <div
                key={lang}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{meta.name}</h3>
                    {langDone === langLessons.length && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Track Complete
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Tutorials</span>
                      <span className="font-semibold tabular-nums">
                        {langDone}/{langLessons.length} ({lessonPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full transition-all duration-300"
                        style={{ width: `${lessonPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>Quiz score</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {langQuizCorrect}/{langQuizzes.length} correct
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onContinueTrack(lang)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Study {meta.name}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
