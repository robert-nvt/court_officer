import { QuizHistory, HistoryStorage, Question, ChapterProgress } from './types';
import { formatTime, getChapterQuestions, getCorrectAnswer } from './questions';

const STORAGE_KEY = 'quiz_history';

/**
 * Lấy lịch sử thi từ localStorage
 */
export function getQuizHistory(): HistoryStorage {
  if (typeof window === 'undefined') {
    return {
      latestPractice: null,
      latestExam: null,
      allResults: [],
      chapterProgress: {}
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const history = JSON.parse(stored);
      // Ensure chapterProgress exists for backward compatibility
      if (!history.chapterProgress) {
        history.chapterProgress = {};
      }
      return history;
    }
  } catch (error) {
    console.error('Error reading quiz history:', error);
  }

  return {
    latestPractice: null,
    latestExam: null,
    allResults: [],
    chapterProgress: {}
  };
}

/**
 * Lưu kết quả quiz vào localStorage
 */
export function saveQuizResult(
  result: any,
  mode: 'practice' | 'exam',
  chapter?: number
): void {
  if (typeof window === 'undefined') return;

  try {
    console.log('Saving quiz result:', { result, mode, chapter });
    const history = getQuizHistory();

    const quizHistory: QuizHistory = {
      id: `${mode}_${Date.now()}`,
      date: new Date().toISOString(),
      mode,
      chapter,
      total: result.total,
      correct: result.correct,
      incorrect: result.incorrect,
      percentage: result.percentage,
      timeSpent: result.timeSpent,
      timeSpentFormatted: formatTime(result.timeSpent),
      answers: result.answers.map((answer: any) => ({
        questionId: answer.question.id,
        question: answer.question.question,
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect
      }))
    };

    // Cập nhật kết quả gần nhất
    if (mode === 'practice') {
      history.latestPractice = quizHistory;
    } else {
      history.latestExam = quizHistory;
    }

    // Thêm vào danh sách tất cả kết quả
    history.allResults.unshift(quizHistory);

    // Giữ chỉ 50 kết quả gần nhất
    if (history.allResults.length > 50) {
      history.allResults = history.allResults.slice(0, 50);
    }

    console.log('Saving to localStorage:', history);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    console.log('Successfully saved to localStorage');
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
}

/**
 * Xóa lịch sử thi
 */
export function clearQuizHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing quiz history:', error);
  }
}

/**
 * Định dạng ngày tháng từ ISO string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Vừa xong';
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Lấy tên chế độ thi
 */
export function getModeLabel(mode: 'practice' | 'exam', chapter?: number): string {
  if (mode === 'practice') {
    return chapter ? `Luyện tập - Chương ${chapter}` : 'Luyện tập';
  }
  return 'Thi thử';
}

/**
 * Lấy thông tin đầy đủ của câu hỏi từ questionId
 */
export function getFullQuestionFromId(questionId: string): Question | null {
  try {
    console.log('Getting full question for ID:', questionId);
    const [chapter, questionNum] = questionId.split('-').map(Number);
    console.log('Parsed chapter and question:', { chapter, questionNum });

    if (!chapter || !questionNum) {
      console.log('Invalid questionId format');
      return null;
    }

    const chapterQuestions = getChapterQuestions(chapter);
    console.log('Chapter questions count:', chapterQuestions.length);

    const question = chapterQuestions.find(q => q.id === questionId);
    console.log('Found question:', question ? 'YES' : 'NO');

    return question || null;
  } catch (error) {
    console.error('Error getting full question:', error);
    return null;
  }
}

/**
 * Chuyển đổi QuizHistory sang định dạng Result cho AnswerGrid
 */
export function convertHistoryToResult(history: QuizHistory): any {
  return {
    correct: history.correct,
    incorrect: history.incorrect,
    total: history.total,
    percentage: history.percentage,
    timeSpent: history.timeSpent,
    answers: history.answers.map(answer => {
      const fullQuestion = getFullQuestionFromId(answer.questionId);
      return {
        question: fullQuestion || {
          id: answer.questionId,
          question: answer.question,
          A: 'Không có dữ liệu',
          B: 'Không có dữ liệu',
          C: 'Không có dữ liệu',
          D: 'Không có dữ liệu',
          correctAnswer: answer.correctAnswer
        },
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect
      };
    })
  };
}

/**
 * Lưu progress của một chương
 */
export function saveChapterProgress(
  chapter: number,
  userAnswers: Record<string, string>,
  currentIndex: number,
  totalQuestions: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getQuizHistory();

    // Calculate correct and incorrect answers
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    Object.entries(userAnswers).forEach(([questionId, userAnswer]) => {
      const correctAnswer = getCorrectAnswer(questionId);
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      } else if (userAnswer) {
        incorrectAnswers++;
      }
    });

    const progress: ChapterProgress = {
      chapter,
      userAnswers,
      currentIndex,
      lastUpdated: new Date().toISOString(),
      totalAnswered: Object.keys(userAnswers).length,
      totalQuestions,
      correctAnswers,
      incorrectAnswers
    };

    history.chapterProgress[chapter] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving chapter progress:', error);
  }
}

/**
 * Lấy progress của một chương
 */
export function getChapterProgress(chapter: number): ChapterProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const history = getQuizHistory();
    return history.chapterProgress[chapter] || null;
  } catch (error) {
    console.error('Error getting chapter progress:', error);
    return null;
  }
}

/**
 * Xóa progress của một chương
 */
export function clearChapterProgress(chapter: number): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getQuizHistory();
    delete history.chapterProgress[chapter];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error clearing chapter progress:', error);
  }
}