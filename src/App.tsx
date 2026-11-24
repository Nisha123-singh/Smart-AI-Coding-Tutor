import { useCallback, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { AiTutorSection } from './components/AiTutorSection';
import { CodeLabSection } from './components/CodeLabSection';
import { CodingPracticeSection } from './components/CodingPracticeSection';
import { DashboardSection } from './components/DashboardSection';
import { HomeSection } from './components/HomeSection';
import { LearnSection } from './components/LearnSection';
import { Navbar } from './components/Navbar';
import { PracticeSection } from './components/PracticeSection';
import { TheorySection } from './components/TheorySection';
import { useAuth } from './context/AuthContext';
import { useProgress } from './hooks/useProgress';
import type { LanguageId, SectionId } from './types';

export default function App() {
  const { authError, clearAuthError } = useAuth();
  const {
    progress,
    toggleLessonComplete,
    recordQuizAnswer,
    clearQuizAnswers,
    incrementCodeRuns,
    incrementTutorQuestions,
    setLastLanguage,
    resetAllProgress,
  } = useProgress();

  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>(
    progress.lastVisitedLanguage
  );
  const [labPreload, setLabPreload] = useState<{ language: LanguageId; code: string } | null>(
    null
  );
  const [tutorCodeContext, setTutorCodeContext] = useState<{
    language: LanguageId;
    code: string;
  } | null>(null);

  const handleNavigate = useCallback((section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectLanguage = useCallback(
    (language: LanguageId) => {
      setSelectedLanguage(language);
      setLastLanguage(language);
    },
    [setLastLanguage]
  );

  const handleSelectLanguageTrack = useCallback(
    (language: LanguageId) => {
      handleSelectLanguage(language);
      handleNavigate('learn');
    },
    [handleSelectLanguage, handleNavigate]
  );

  const handleOpenInCodeLab = useCallback(
    (language: LanguageId, code: string) => {
      handleSelectLanguage(language);
      setLabPreload({ language, code });
      handleNavigate('lab');
    },
    [handleSelectLanguage, handleNavigate]
  );

  const handleAskTutorWithCode = useCallback(
    (language: LanguageId, code: string) => {
      setTutorCodeContext({ language, code });
      handleNavigate('tutor');
    },
    [handleNavigate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {authError && (
        <div
          role="alert"
          className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-2.5 text-sm text-red-800"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={clearAuthError}
              aria-label="Dismiss sign-in error"
              className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeSection === 'home' && (
          <HomeSection
            progress={progress}
            onNavigate={handleNavigate}
            onSelectLanguageTrack={handleSelectLanguageTrack}
          />
        )}

        {activeSection === 'learn' && (
          <LearnSection
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            progress={progress}
            onToggleComplete={toggleLessonComplete}
            onOpenInCodeLab={handleOpenInCodeLab}
          />
        )}

        {activeSection === 'theory' && (
          <TheorySection
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onOpenInCodeLab={handleOpenInCodeLab}
            onAskTutorWithCode={handleAskTutorWithCode}
          />
        )}

        {activeSection === 'tutor' && (
          <AiTutorSection
            pendingCodeContext={tutorCodeContext}
            onClearCodeContext={() => setTutorCodeContext(null)}
            onQuestionAsked={incrementTutorQuestions}
            onOpenInCodeLab={handleOpenInCodeLab}
          />
        )}

        {activeSection === 'lab' && (
          <CodeLabSection
            initialLanguage={selectedLanguage}
            externalCode={labPreload}
            onConsumeExternalCode={() => setLabPreload(null)}
            onCodeRun={incrementCodeRuns}
            onAskTutorWithCode={handleAskTutorWithCode}
          />
        )}

        {activeSection === 'practice' && (
          <PracticeSection
            progress={progress}
            onAnswerQuestion={recordQuizAnswer}
            onResetQuiz={clearQuizAnswers}
          />
        )}

        {activeSection === 'coding-practice' && <CodingPracticeSection />}

        {activeSection === 'dashboard' && (
          <DashboardSection
            progress={progress}
            onNavigate={handleNavigate}
            onContinueTrack={handleSelectLanguageTrack}
            onResetProgress={resetAllProgress}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Smart AI Coding Tutor · Beginner Programming in Python, Java, C++ &amp; SQL
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('learn')}
              className="hover:text-slate-800 cursor-pointer"
            >
              Tutorials
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('theory')}
              className="hover:text-slate-800 cursor-pointer"
            >
              Theory
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('tutor')}
              className="hover:text-slate-800 cursor-pointer"
            >
              AI Tutor
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('lab')}
              className="hover:text-slate-800 cursor-pointer"
            >
              Code Lab
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('practice')}
              className="hover:text-slate-800 cursor-pointer"
            >
              Practice
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
