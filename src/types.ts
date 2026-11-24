export type SectionId =
  | 'home'
  | 'learn'
  | 'theory'
  | 'tutor'
  | 'lab'
  | 'practice'
  | 'coding-practice'
  | 'dashboard';

export type LanguageId = 'python' | 'java' | 'cpp' | 'sql';

export type CodingLanguageId = 'python' | 'java' | 'cpp';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type CodingTopic =
  | 'Arrays'
  | 'Strings'
  | 'Math & Loops'
  | 'Recursion & DP'
  | 'Searching & Sorting';

export interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
}

export interface CodingProblem {
  id: string;
  number: string;
  title: string;
  topic: CodingTopic;
  difficulty: DifficultyLevel;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  sampleExplanation: string;
  starterCode: Record<CodingLanguageId, string>;
  testCases: CodingTestCase[];
}

export interface MistakeExample {
  title: string;
  wrongCode: string;
  rightCode: string;
  reason: string;
}

export interface CodeLineExplanation {
  lines: string;
  explanation: string;
}

export interface TutorialLesson {
  id: string;
  language: LanguageId;
  number: string;
  title: string;
  duration: string;
  summary: string;
  explanation: string[];
  theoryPoints: string[];
  keyPoints: string[];
  code: string;
  codeExplanation: CodeLineExplanation[];
  commonMistakes: MistakeExample[];
}

export interface TheoryTerm {
  term: string;
  definition: string;
}

export interface TheoryTopic {
  id: string;
  language: LanguageId;
  number: string;
  title: string;
  summary: string;
  points: string[];
  keyTerms: TheoryTerm[];
  exampleCode: string;
}

export interface QuizQuestion {
  id: string;
  language: LanguageId;
  topic: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ProgressState {
  completedLessons: string[];
  quizAnswers: Record<string, number>;
  codeRuns: number;
  tutorQuestions: number;
  lastVisitedLanguage: LanguageId;
}
