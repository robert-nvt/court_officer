'use client';

import React from 'react';
import Link from 'next/link';
import { getQuizHistory, clearQuizHistory, formatDate, getModeLabel } from '@/lib/history';

export default function HistoryPage() {
  const [history, setHistory] = React.useState(getQuizHistory());
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  // Refresh history when component mounts
  React.useEffect(() => {
    const handleStorageChange = () => {
      setHistory(getQuizHistory());
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClearHistory = () => {
    clearQuizHistory();
    setHistory(getQuizHistory());
    setShowConfirmDialog(false);
  };

  if (history.allResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Lịch sử thi</h1>
              <div className="w-6"></div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6 mx-auto">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch sử thi</h2>
            <p className="text-gray-600 mb-8">Bạn chưa hoàn thành bài thi hay luyện tập nào cả.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bắt đầu thi
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử thi</h1>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {history.allResults.map((result) => {
            const percentageColor = result.percentage >= 80 ? 'text-green-600' :
                                  result.percentage >= 60 ? 'text-yellow-600' :
                                  'text-red-600';

            const percentageBg = result.percentage >= 80 ? 'bg-green-50' :
                               result.percentage >= 60 ? 'bg-yellow-50' :
                               'bg-red-50';

            const modeColor = result.mode === 'practice' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

            return (
              <div key={result.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${modeColor} mb-2`}>
                        {getModeLabel(result.mode, result.chapter)}
                      </span>
                      <div className="text-sm text-gray-500">
                        {formatDate(result.date)}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${percentageColor}`}>
                      {result.percentage}%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{result.correct}</div>
                      <div className="text-xs text-gray-500">Đúng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">{result.incorrect}</div>
                      <div className="text-xs text-gray-500">Sai</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-600">{result.timeSpentFormatted}</div>
                      <div className="text-xs text-gray-500">Thời gian</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {result.total} câu hỏi
                    </div>
                    <Link
                      href={`/result/${result.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                      Xem chi tiết
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xóa tất cả lịch sử?</h3>
            <p className="text-gray-600 mb-6">
              Hành động này sẽ xóa vĩnh viễn tất cả lịch sử thi của bạn. Bạn không thể hoàn tác hành động này.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}