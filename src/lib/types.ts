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