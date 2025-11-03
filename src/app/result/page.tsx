'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { ResultCard } from '@/components/ResultCard';
import { AnswerGrid, QuestionModal } from '@/components/AnswerGrid';
import { saveQuizResult } from '@/lib/history';

export default function ResultPage() {
  const router = useRouter();
  const { state, getResults, resetQuiz } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Redirect to home if no quiz is completed
    if (!state.isCompleted) {
      router.push('/');
    }
  }, [state.isCompleted, router]);

  const result = getResults();

  // Save result to history when component mounts
  useEffect(() => {
    if (result && !saved) {
      console.log('Saving result to history:', { mode: state.mode, chapter: state.chapter });
      saveQuizResult(result, state.mode, state.chapter);
      setSaved(true);
    }
  }, [result, saved, state.mode, state.chapter]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  const handleRetake = () => {
    if (state.mode === 'practice') {
      // For practice mode, restart the same chapter
      if (state.chapter) {
        router.push(`/practice/${state.chapter}`);
      } else {
        router.push('/practice');
      }
    } else {
      // For exam mode, go to exam start page
      router.push('/practice/exam');
    }
  };

  const handleHome = () => {
    resetQuiz();
    router.push('/');
  };

  const handleQuestionClick = (answer: any, index: number) => {
    setSelectedAnswer(answer);
    setSelectedQuestionNumber(index + 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnswer(null);
    setSelectedQuestionNumber(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {state.mode === 'exam' ? 'Kết quả thi thử' : 'Kết quả luyện tập'}
            </h1>
            <p className="text-gray-600">
              {state.mode === 'exam'
                ? `Bài thi với ${result.total} câu hỏi`
                : `Luyện tập Chương ${state.chapter || ''}`
              }
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Result Summary */}
          <div>
            <ResultCard result={result} />

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm lại
              </button>

              <Link
                href="/"
                onClick={handleHome}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Về trang chủ
              </Link>
            </div>
          </div>

          {/* Answer Grid */}
          <div>
            <AnswerGrid
              result={result}
              onQuestionClick={handleQuestionClick}
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê chi tiết</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {result.correct}
              </div>
              <div className="text-sm font-medium text-gray-700">Câu đúng</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((result.correct / result.total) * 100)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {result.incorrect}
              </div>
              <div className="text-sm font-medium text-gray-700">Câu sai</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((result.incorrect / result.total) * 100)}%
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {result.total}
              </div>
              <div className="text-sm font-medium text-gray-700">Tổng câu</div>
              <div className="text-xs text-gray-500 mt-1">100%</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-medium text-gray-700">Thời gian</div>
              <div className="text-xs text-gray-500 mt-1">
                {result.timeSpent < 60
                  ? `${result.timeSpent} giây`
                  : `${Math.floor(result.timeSpent / 60)} phút ${result.timeSpent % 60} giây`
                }
              </div>
            </div>
          </div>

          {/* Performance by Chapter (if available) */}
          {state.mode === 'exam' && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích theo chương</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((chapter) => {
                  const chapterAnswers = result.answers.filter(answer =>
                    answer.question.id.startsWith(`${chapter}-`)
                  );
                  const chapterCorrect = chapterAnswers.filter(answer => answer.isCorrect).length;
                  const chapterTotal = chapterAnswers.length;
                  const chapterPercentage = chapterTotal > 0
                    ? Math.round((chapterCorrect / chapterTotal) * 100)
                    : 0;

                  return (
                    <div key={chapter} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">Chương {chapter}</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {chapterPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            chapterPercentage >= 80
                              ? 'bg-green-500'
                              : chapterPercentage >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${chapterPercentage}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {chapterCorrect}/{chapterTotal} câu đúng
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Study Recommendations */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đề xuất học tập</h2>

          <div className="space-y-4">
            {result.percentage >= 80 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-green-800">Xuất sắc!</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Bạn đã nắm vững kiến thức rất tốt. Hãy tiếp tục duy trì và thử các bài thi nâng cao hơn.
                  </p>
                </div>
              </div>
            )}

            {result.percentage >= 60 && result.percentage < 80 && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-800">Khá tốt!</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Bạn đã hiểu cơ bản kiến thức. Hãy xem lại các câu sai để củng cố thêm kiến thức.
                  </p>
                </div>
              </div>
            )}

            {result.percentage < 60 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-800">Cần cố gắng hơn!</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Bạn cần ôn tập lại kiến thức cơ bản. Hãy xem kỹ các đáp án sai và làm lại bài tập tương tự.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Question Modal */}
      {selectedAnswer && (
        <QuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          answer={selectedAnswer}
          questionNumber={selectedQuestionNumber}
        />
      )}
    </div>
  );
}