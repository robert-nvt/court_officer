'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { QuizState, Question, Result } from '@/lib/types';
import { getChapterQuestions, getRandomQuestions, calculateResults } from '@/lib/questions';
import { saveQuizResult, saveChapterProgress, getChapterProgress, clearChapterProgress } from '@/lib/history';

type QuizAction =
  | { type: 'START_QUIZ'; payload: { questions: Question[]; mode: 'practice' | 'exam'; chapter?: number; userAnswers?: Record<string, string>; currentIndex?: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_QUESTION'; payload: number }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; answer: string } }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  isCompleted: false,
  timeLeft: 60 * 60, // 60 minutes in seconds
  mode: 'practice',
  chapter: undefined,
  startTime: undefined,
  endTime: undefined,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        questions: action.payload.questions,
        currentQuestionIndex: action.payload.currentIndex || 0,
        userAnswers: action.payload.userAnswers || {},
        mode: action.payload.mode,
        chapter: action.payload.chapter,
        timeLeft: action.payload.mode === 'exam' ? 60 * 60 : Infinity,
        startTime: Date.now(),
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
      };

    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case 'GO_TO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, Math.min(action.payload, state.questions.length - 1)),
      };

    case 'ANSWER_QUESTION':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isCompleted: true,
        endTime: Date.now(),
      };

    case 'SET_TIME_LEFT':
      return {
        ...state,
        timeLeft: action.payload,
      };

    case 'RESET_QUIZ':
      return initialState;

    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
  startPractice: (chapter: number) => void;
  startExam: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  getResults: () => Result | null;
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
  getProgress: () => { answered: number; total: number; percentage: number };
  restartPractice: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Timer effect for exam mode
  useEffect(() => {
    if (state.mode === 'exam' && state.timeLeft > 0 && !state.isCompleted) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TIME_LEFT', payload: state.timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.mode === 'exam' && state.timeLeft === 0 && !state.isCompleted) {
      dispatch({ type: 'COMPLETE_QUIZ' });
    }
  }, [state.timeLeft, state.isCompleted, state.mode]);

  const startPractice = (chapter: number) => {
    const questions = getChapterQuestions(chapter);

    // Try to load existing progress
    const existingProgress = getChapterProgress(chapter);

    if (existingProgress) {
      console.log('Loading existing progress for chapter', chapter, existingProgress);
      dispatch({
        type: 'START_QUIZ',
        payload: {
          questions,
          mode: 'practice',
          chapter,
          userAnswers: existingProgress.userAnswers,
          currentIndex: Math.min(existingProgress.currentIndex, questions.length - 1)
        }
      });
    } else {
      console.log('Starting fresh practice for chapter', chapter);
      dispatch({ type: 'START_QUIZ', payload: { questions, mode: 'practice', chapter } });
    }
  };

  const startExam = () => {
    const questions = getRandomQuestions(60);
    dispatch({ type: 'START_QUIZ', payload: { questions, mode: 'exam' } });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const goToQuestion = (index: number) => {
    dispatch({ type: 'GO_TO_QUESTION', payload: index });

    // Save progress for practice mode
    if (state.mode === 'practice' && state.chapter !== undefined) {
      setTimeout(() => {
        saveChapterProgress(
          state.chapter as number,
          state.userAnswers,
          index,
          state.questions.length
        );
      }, 100);
    }
  };

  const answerQuestion = (questionId: string, answer: string) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, answer } });

    // Save progress for practice mode
    if (state.mode === 'practice' && state.chapter !== undefined) {
      setTimeout(() => {
        saveChapterProgress(
          state.chapter as number,
          { ...state.userAnswers, [questionId]: answer },
          state.currentQuestionIndex,
          state.questions.length
        );
      }, 100);
    }
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });

    // Save result to history when quiz is completed
    setTimeout(() => {
      const results = getResults();
      if (results) {
        saveQuizResult(results, state.mode, state.chapter);
      }
    }, 100);
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const getResults = (): Result | null => {
    if (!state.isCompleted || !state.startTime || !state.endTime) {
      return null;
    }
    return calculateResults(state.questions, state.userAnswers, state.startTime, state.endTime);
  };

  const isLastQuestion = () => {
    return state.currentQuestionIndex === state.questions.length - 1;
  };

  const isFirstQuestion = () => {
    return state.currentQuestionIndex === 0;
  };

  const getProgress = () => {
    const answered = Object.keys(state.userAnswers).length;
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
    return { answered, total, percentage };
  };

  const restartPractice = () => {
    if (state.mode === 'practice' && state.chapter !== undefined) {
      // Clear progress for this chapter
      clearChapterProgress(state.chapter as number);
      // Restart fresh
      startPractice(state.chapter as number);
    }
  };

  const value: QuizContextType = {
    state,
    dispatch,
    startPractice,
    startExam,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    answerQuestion,
    completeQuiz,
    resetQuiz,
    getResults,
    isLastQuestion,
    isFirstQuestion,
    getProgress,
    restartPractice,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}