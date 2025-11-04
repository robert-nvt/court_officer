import { Question, ChapterData, AnswerData } from './types';

// Import data files
import chuong1Data from '../data/chuong1.json';
import chuong2Data from '../data/chuong2.json';
import chuong3Data from '../data/chuong3.json';
import dapan1Data from '../data/dapan1.json';
import dapan2Data from '../data/dapan2.json';
import dapan3Data from '../data/dapan3.json';

// Chapter data
const CHAPTERS_DATA = {
  1: chuong1Data as ChapterData,
  2: chuong2Data as ChapterData,
  3: chuong3Data as ChapterData,
};

// Answer data
const ANSWERS_DATA = {
  1: dapan1Data as AnswerData,
  2: dapan2Data as AnswerData,
  3: dapan3Data as AnswerData,
};

/**
 * Convert chapter data to Question array format (shuffled)
 */
export function getChapterQuestions(chapter: number, shuffle: boolean = true): Question[] {
  const chapterData = CHAPTERS_DATA[chapter as keyof typeof CHAPTERS_DATA];
  if (!chapterData) {
    throw new Error(`Chapter ${chapter} not found`);
  }

  const answerData = ANSWERS_DATA[chapter as keyof typeof ANSWERS_DATA];
  if (!answerData) {
    throw new Error(`Answer data for chapter ${chapter} not found`);
  }

  const questions = Object.entries(chapterData).map(([id, questionData]) => ({
    id: `${chapter}-${id}`,
    question: questionData.question,
    A: questionData.A,
    B: questionData.B,
    C: questionData.C,
    D: questionData.D,
    correctAnswer: answerData[id],
  }));

  // Only shuffle if requested and no existing progress
  if (shuffle) {
    // Try to get shuffled order from localStorage to maintain consistency
    const storageKey = `chapter_${chapter}_shuffled_order`;
    const savedOrder = localStorage.getItem(storageKey);

    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        // Reorder questions according to saved order
        return order.map((index: number) => questions[index]);
      } catch (e) {
        console.warn('Failed to parse saved order, generating new one');
      }
    }

    // Generate new shuffled order and save it
    const shuffledQuestions = [...questions];
    const order: number[] = [];

    // Fisher-Yates shuffle
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    // Save the order
    const indices = shuffledQuestions.map(q => questions.findIndex(qq => qq.id === q.id));
    localStorage.setItem(storageKey, JSON.stringify(indices));

    return shuffledQuestions;
  }

  return questions;
}

/**
 * Get all questions from all chapters
 */
export function getAllQuestions(): Question[] {
  const allQuestions: Question[] = [];

  for (let chapter = 1; chapter <= 3; chapter++) {
    try {
      const chapterQuestions = getChapterQuestions(chapter);
      allQuestions.push(...chapterQuestions);
    } catch (error) {
      console.error(`Error loading chapter ${chapter}:`, error);
    }
  }

  return allQuestions;
}

/**
 * Get random questions from all chapters
 */
export function getRandomQuestions(count: number): Question[] {
  const allQuestions = getAllQuestions();
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, allQuestions.length));
}

/**
 * Get the correct answer for a question
 */
export function getCorrectAnswer(questionId: string): string {
  // Extract chapter number and question number from ID
  const [chapter, questionNum] = questionId.split('-').map(Number);
  const answerData = ANSWERS_DATA[chapter as keyof typeof ANSWERS_DATA];
  return answerData ? answerData[questionNum.toString()] : '';
}

/**
 * Calculate quiz results
 */
export function calculateResults(
  questions: Question[],
  userAnswers: Record<string, string>,
  startTime: number,
  endTime: number
) {
  const total = questions.length;
  let correct = 0;
  const answers = questions.map(question => {
    const userAnswer = userAnswers[question.id] || '';
    const correctAnswer = getCorrectAnswer(question.id);
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      correct++;
    }

    return {
      question,
      userAnswer,
      correctAnswer,
      isCorrect,
    };
  });

  const incorrect = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds

  return {
    correct,
    incorrect,
    total,
    percentage,
    timeSpent,
    answers,
  };
}

/**
 * Reset shuffled order for a chapter (for restarting practice)
 */
export function resetChapterOrder(chapter: number): void {
  const storageKey = `chapter_${chapter}_shuffled_order`;
  localStorage.removeItem(storageKey);
}

/**
 * Format time from seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}