'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getQuizHistory, convertHistoryToResult } from '@/lib/history';
import { AnswerGrid, QuestionModal } from '@/components/AnswerGrid';

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = React.useState<any>(null);
  const [resultForGrid, setResultForGrid] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = React.useState<any>(null);
  const [selectedQuestionNumber, setSelectedQuestionNumber] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const loadResult = () => {
      try {
        const history = getQuizHistory();
        const foundResult = history.allResults.find(r => r.id === params.id);

        if (foundResult) {
          console.log('Found result:', foundResult);
          // Convert QuizHistory to Result format for AnswerGrid
          const resultForAnswerGrid = convertHistoryToResult(foundResult);
          console.log('Converted result for grid:', resultForAnswerGrid);
          setResult(foundResult);
          setResultForGrid(resultForAnswerGrid);
        } else {
          setError('Không tìm thấy kết quả');
        }
      } catch (err) {
        setError('Lỗi khi tải kết quả');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4 mx-auto">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error || 'Không tìm thấy kết quả'}</p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại lịch sử
          </Link>
        </div>
      </div>
    );
  }

  const percentageColor = result.percentage >= 80 ? 'text-green-600' :
                        result.percentage >= 60 ? 'text-yellow-600' :
                        'text-red-600';

  const percentageBg = result.percentage >= 80 ? 'bg-green-50' :
                     result.percentage >= 60 ? 'bg-yellow-50' :
                     'bg-red-50';

  const modeColor = result.mode === 'practice' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết kết quả</h1>
            <div className="w-6"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${modeColor} mb-2`}>
                {result.mode === 'practice' ? `Luyện tập - Chương ${result.chapter}` : 'Thi thử'}
              </span>
              <div className="text-sm text-gray-500">
                {new Date(result.date).toLocaleString('vi-VN')}
              </div>
            </div>
            <div className={`text-4xl font-bold ${percentageColor}`}>
              {result.percentage}%
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className={`${percentageBg} rounded-lg p-4 text-center`}>
              <div className={`text-2xl font-bold ${percentageColor} mb-1`}>
                {result.correct}
              </div>
              <div className="text-xs text-gray-600">Đúng</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {result.incorrect}
              </div>
              <div className="text-xs text-gray-600">Sai</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {result.total}
              </div>
              <div className="text-xs text-gray-600">Tổng</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {result.timeSpentFormatted}
              </div>
              <div className="text-xs text-gray-600">Thời gian</div>
            </div>
          </div>
        </div>

        {/* Answer Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <AnswerGrid
              result={resultForGrid}
              onQuestionClick={handleQuestionClick}
            />
          </div>

          {/* Quick Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt nhanh</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{result.correct}</div>
                  <div className="text-sm text-green-700">Câu đúng</div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.round((result.correct / result.total) * 100)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{result.incorrect}</div>
                  <div className="text-sm text-red-700">Câu sai</div>
                  <div className="text-xs text-red-600 mt-1">
                    {Math.round((result.incorrect / result.total) * 100)}%
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Chế độ thi</div>
                <div className="font-semibold text-gray-900">
                  {result.mode === 'practice' ? `Luyện tập - Chương ${result.chapter}` : 'Thi thử'}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-2">Thời gian làm bài</div>
                <div className="font-semibold text-blue-900">{result.timeSpentFormatted}</div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Tỷ lệ đúng</div>
                <div className={`text-3xl font-bold ${
                  result.percentage >= 80 ? 'text-green-600' :
                  result.percentage >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {result.percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/history"
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center"
          >
            Xem lịch sử
          </Link>
          <Link
            href="/"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center"
          >
            Làm bài mới
          </Link>
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

  // Handler functions
  function handleQuestionClick(answer: any, index: number) {
    setSelectedAnswer(answer);
    setSelectedQuestionNumber(index + 1);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedAnswer(null);
    setSelectedQuestionNumber(0);
  }
}