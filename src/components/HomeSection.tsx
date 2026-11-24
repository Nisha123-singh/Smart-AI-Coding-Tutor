import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Code2, MessageSquare, Terminal } from 'lucide-react';
import { LANGUAGE_META, TUTORIAL_LESSONS } from '../data/tutorials';
import type { LanguageId, ProgressState, SectionId } from '../types';

interface HomeSectionProps {
  progress: ProgressState;
  onNavigate: (section: SectionId) => void;
  onSelectLanguageTrack: (language: LanguageId) => void;
}

const HERO_IMAGE_SRC = '/src/assets/images/hero_coding_tutor_1795186602750.jpg';

const TRACK_ORDER: LanguageId[] = ['python', 'java', 'cpp', 'sql'];

export function HomeSection({
  progress,
  onNavigate,
  onSelectLanguageTrack,
}: HomeSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      {/* Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="text-sm font-medium text-sky-700">
            Beginner Programming Platform · Python, Java, C++ &amp; SQL
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]"
            style={{ textWrap: 'balance' }}
          >
            Learn to code step by step with your own AI Tutor
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            Build strong programming fundamentals from day one. Follow structured tutorials, explore
            language theory, test snippets in the Code Lab, ask questions anytime, and track every
            milestone.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('theory')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              Read Theory
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex">
          <div className="w-full rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex items-center justify-center min-h-[280px]">
            {!imageError ? (
              <img
                src={HERO_IMAGE_SRC}
                alt="Beginner developer studying Python, Java, C++, and SQL code examples on a clean desk"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-3">
                <Code2 className="w-12 h-12 text-sky-600" />
                <p className="text-base font-semibold text-slate-900">
                  Interactive Python, Java, C++ &amp; SQL Studio
                </p>
                <p className="text-sm text-slate-600 max-w-xs">
                  Guided lessons, clear theory, live code evaluation, and instant AI explanations.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Four-Step Workflow Strip */}
      <section aria-label="How it works" className="border-y border-slate-200 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-left group space-y-2 p-2 -m-2 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>01. Tutorials &amp; Theory</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Short lessons, theory notes, and common mistakes for Python, Java, C++, and SQL.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('lab')}
            className="text-left group space-y-2 p-2 -m-2 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
              <Terminal className="w-4 h-4 text-sky-600" />
              <span>02. Run in Code Lab</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Paste or write code and inspect output, mistakes, and line-by-line explanations.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tutor')}
            className="text-left group space-y-2 p-2 -m-2 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>03. Ask the AI Tutor</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Get beginner-friendly answers and step-by-step debugging guidance.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="text-left group space-y-2 p-2 -m-2 rounded-lg hover:bg-slate-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>04. Practice Quizzes</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Check your understanding with bite-sized questions and explanations.
            </p>
          </button>
        </div>
      </section>

      {/* Choose Your Language Track */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Choose a Language Track
            </h2>
            <p className="text-sm text-slate-600">
              Start with Python for readability, Java for structure, C++ for systems, or SQL for databases.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-semibold text-sky-700 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            View full progress
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRACK_ORDER.map((lang) => {
            const meta = LANGUAGE_META[lang];
            const lessons = TUTORIAL_LESSONS.filter((l) => l.language === lang);
            const completedCount = lessons.filter((l) =>
              progress.completedLessons.includes(l.id)
            ).length;
            const percent = Math.round((completedCount / lessons.length) * 100);

            return (
              <div
                key={lang}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{meta.fileExtension}</span>
                    <span className="tabular-nums">
                      {completedCount}/{lessons.length} lessons
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{meta.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{meta.tagline}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Track progress</span>
                      <span className="font-semibold tabular-nums">{percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectLanguageTrack(lang)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Open {meta.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
