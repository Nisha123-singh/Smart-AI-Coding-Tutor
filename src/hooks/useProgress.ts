import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { OperationType, db, handleFirestoreError } from '../firebase';
import type { LanguageId, ProgressState } from '../types';

const STORAGE_KEY = 'smart_ai_coding_tutor_progress_v1';

const DEFAULT_PROGRESS: ProgressState = {
  completedLessons: [],
  quizAnswers: {},
  codeRuns: 0,
  tutorQuestions: 0,
  lastVisitedLanguage: 'python',
};

function sanitizeLanguage(value: unknown): LanguageId {
  if (value === 'java' || value === 'cpp' || value === 'sql') {
    return value;
  }
  return 'python';
}

function sanitizeProgress(raw: Partial<ProgressState>): ProgressState {
  const completedLessons = Array.isArray(raw.completedLessons)
    ? raw.completedLessons
        .filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 32)
        .slice(0, 50)
    : [];

  const quizAnswers: Record<string, number> = {};
  if (raw.quizAnswers && typeof raw.quizAnswers === 'object') {
    const entries = Object.entries(raw.quizAnswers).slice(0, 50);
    for (const [k, v] of entries) {
      if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 10) {
        quizAnswers[k] = v;
      }
    }
  }

  const clampCounter = (n: unknown) =>
    typeof n === 'number' && Number.isFinite(n)
      ? Math.max(0, Math.min(100000, Math.floor(n)))
      : 0;

  return {
    completedLessons,
    quizAnswers,
    codeRuns: clampCounter(raw.codeRuns),
    tutorQuestions: clampCounter(raw.tutorQuestions),
    lastVisitedLanguage: sanitizeLanguage(raw.lastVisitedLanguage),
  };
}

function loadLocalProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return sanitizeProgress(JSON.parse(raw) as Partial<ProgressState>);
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useProgress() {
  const { user, authReady } = useAuth();
  const [progress, setProgress] = useState<ProgressState>(loadLocalProgress);
  const [fatalError, setFatalError] = useState<Error | null>(null);
  const progressRef = useRef<ProgressState>(progress);
  const remoteInitializedRef = useRef<boolean>(false);

  if (fatalError) {
    throw fatalError;
  }

  useEffect(() => {
    progressRef.current = progress;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  // Sync with Firestore when authenticated with a verified email
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      remoteInitializedRef.current = false;
      return;
    }

    const docPath = `userProgress/${user.uid}`;
    const docRef = doc(db, 'userProgress', user.uid);

    const unsubscribe = onSnapshot(
      docRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<ProgressState>;
          const clean = sanitizeProgress(data);
          remoteInitializedRef.current = true;
          setProgress(clean);
        } else if (!remoteInitializedRef.current) {
          remoteInitializedRef.current = true;
          const seed = sanitizeProgress(progressRef.current);
          try {
            await setDoc(docRef, {
              userId: user.uid,
              completedLessons: seed.completedLessons,
              quizAnswers: seed.quizAnswers,
              codeRuns: seed.codeRuns,
              tutorQuestions: seed.tutorQuestions,
              lastVisitedLanguage: seed.lastVisitedLanguage,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            try {
              handleFirestoreError(error, OperationType.CREATE, docPath);
            } catch (wrapped) {
              setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
            }
          }
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, docPath);
        } catch (wrapped) {
          setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      }
    );

    return unsubscribe;
  }, [authReady, user]);

  const applyUpdate = useCallback(
    (updater: (prev: ProgressState) => ProgressState) => {
      const next = sanitizeProgress(updater(progressRef.current));
      progressRef.current = next;
      setProgress(next);

      if (authReady && user && user.emailVerified && remoteInitializedRef.current) {
        const docPath = `userProgress/${user.uid}`;
        const docRef = doc(db, 'userProgress', user.uid);
        void updateDoc(docRef, {
          completedLessons: next.completedLessons,
          quizAnswers: next.quizAnswers,
          codeRuns: next.codeRuns,
          tutorQuestions: next.tutorQuestions,
          lastVisitedLanguage: next.lastVisitedLanguage,
          updatedAt: serverTimestamp(),
        }).catch((error) => {
          try {
            handleFirestoreError(error, OperationType.UPDATE, docPath);
          } catch (wrapped) {
            setFatalError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
          }
        });
      }
    },
    [authReady, user]
  );

  const toggleLessonComplete = useCallback(
    (lessonId: string) => {
      applyUpdate((prev) => {
        const exists = prev.completedLessons.includes(lessonId);
        return {
          ...prev,
          completedLessons: exists
            ? prev.completedLessons.filter((id) => id !== lessonId)
            : [...prev.completedLessons, lessonId],
        };
      });
    },
    [applyUpdate]
  );

  const recordQuizAnswer = useCallback(
    (questionId: string, optionIndex: number) => {
      applyUpdate((prev) => ({
        ...prev,
        quizAnswers: {
          ...prev.quizAnswers,
          [questionId]: optionIndex,
        },
      }));
    },
    [applyUpdate]
  );

  const clearQuizAnswers = useCallback(
    (questionIds?: string[]) => {
      applyUpdate((prev) => {
        if (!questionIds) {
          return { ...prev, quizAnswers: {} };
        }
        const nextAnswers = { ...prev.quizAnswers };
        for (const id of questionIds) {
          delete nextAnswers[id];
        }
        return { ...prev, quizAnswers: nextAnswers };
      });
    },
    [applyUpdate]
  );

  const incrementCodeRuns = useCallback(() => {
    applyUpdate((prev) => ({ ...prev, codeRuns: prev.codeRuns + 1 }));
  }, [applyUpdate]);

  const incrementTutorQuestions = useCallback(() => {
    applyUpdate((prev) => ({ ...prev, tutorQuestions: prev.tutorQuestions + 1 }));
  }, [applyUpdate]);

  const setLastLanguage = useCallback(
    (language: LanguageId) => {
      applyUpdate((prev) => ({ ...prev, lastVisitedLanguage: language }));
    },
    [applyUpdate]
  );

  const resetAllProgress = useCallback(() => {
    applyUpdate(() => DEFAULT_PROGRESS);
  }, [applyUpdate]);

  return {
    progress,
    toggleLessonComplete,
    recordQuizAnswer,
    clearQuizAnswers,
    incrementCodeRuns,
    incrementTutorQuestions,
    setLastLanguage,
    resetAllProgress,
  };
}
