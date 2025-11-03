export interface Question {
  id: string;
  question: string;
  A: string;
  B: string;
  C: string;
  D?: string;
  correctAnswer?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  isCompleted: boolean;
  timeLeft: number;
  mode: 'practice' | 'exam';
  chapter?: number;
  startTime?: number;
  endTime?: number;
}

export interface Result {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
  timeSpent: number;
  answers: Array<{
    question: Question;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export interface ChapterData {
  [key: string]: {
    question: string;
    A: string;
    B: string;
    C: string;
    D?: string;
  };
}

export interface AnswerData {
  [key: string]: string;
}

export interface QuizHistory {
  id: string;
  date: string;
  mode: 'practice' | 'exam';
  chapter?: number;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  timeSpent: number;
  timeSpentFormatted: string;
  answers: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export interface ChapterProgress {
  chapter: number;
  userAnswers: Record<string, string>;
  currentIndex: number;
  lastUpdated: string;
  totalAnswered: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface HistoryStorage {
  latestPractice: QuizHistory | null;
  latestExam: QuizHistory | null;
  allResults: QuizHistory[];
  chapterProgress: Record<number, ChapterProgress>; // Progress for each chapter
}