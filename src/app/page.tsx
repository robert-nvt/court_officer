'use client';

import React from 'react';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { getQuizHistory } from '@/lib/history';

const getHistoryData = () => {
  if (typeof window === 'undefined') {
    return { latestExam: null };
  }
  try {
    const stored = localStorage.getItem('quiz_history');
    if (stored) {
      const history = JSON.parse(stored);
      if (!history.chapterProgress) {
        history.chapterProgress = {};
      }
      return history;
    }
  } catch (error) {
    console.error('Error reading quiz history:', error);
  }
  return { latestExam: null, chapterProgress: {} };
};

export default function HomePage() {
    const { resetQuiz } = useQuiz();

    // Reset any existing quiz state when visiting home
    React.useEffect(() => {
        resetQuiz();
    }, [resetQuiz]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Thi Trắc Nghiệm
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Lý luận Chính trị - Hiến pháp 2013, Luật Cán bộ công chức, Luật Tổ chức Tòa án nhân dân
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Practice Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center mb-2">
                                Luyện tập theo chương
                            </h2>
                            <p className="text-green-100 text-center">
                                Ôn tập kiến thức theo từng chương cụ thể
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Chương 1: Hiến pháp 2013</span>
                                    <span className="text-sm text-gray-500">221 câu hỏi</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Chương 2: Luật CBCC</span>
                                    <span className="text-sm text-gray-500">Nhiều câu hỏi</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700">Chương 3: Luật TAND</span>
                                    <span className="text-sm text-gray-500">Nhiều câu hỏi</span>
                                </div>
                            </div>

                            <Link
                                href="/practice"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Bắt đầu luyện tập
                            </Link>
                        </div>
                    </div>

                    {/* Exam Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center mb-2">
                                Thi thử
                            </h2>
                            <p className="text-blue-100 text-center">
                                Kiểm tra kiến thức tổng hợp với 60 câu hỏi ngẫu nhiên
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700">60 câu hỏi ngẫu nhiên</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700">Thời gian: 60 phút</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-gray-700">Tổng hợp 3 chương</span>
                                </div>
                            </div>

                            <Link
                                href="/practice/exam"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Bắt đầu thi thử
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                {/* <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Kiểm tra ngay lập tức</h3>
              <p className="text-gray-600 text-sm">Nhận kết quả và giải thích chi tiết ngay sau khi hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quản lý thời gian</h3>
              <p className="text-gray-600 text-sm">Đồng hồ đếm ngược giúp rèn luyện kỹ năng làm bài</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thống kê chi tiết</h3>
              <p className="text-gray-600 text-sm">Phân tích kết quả theo từng câu và chương kiến thức</p>
            </div>
          </div>
        </div> */}

                {/* Recent Results Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kết quả & Tiến độ</h2>
                        <p className="text-gray-600">Xem lại kết quả thi thử và tiến độ luyện tập</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Thi thử gần nhất */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    Thi thử gần nhất
                                </h2>
                                <p className="text-blue-100 text-center text-sm">
                                    Xem lại kết quả thi thử
                                </p>
                            </div>

                            <div className="p-6">
                                {(() => {
                                    const historyData = getHistoryData();
                                    return historyData.latestExam ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Thời gian</span>
                                                <span className="text-gray-700">{new Date(historyData.latestExam.date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className={`p-4 rounded-lg text-center ${
                                                historyData.latestExam.percentage >= 80 ? 'bg-green-50 border border-green-200' :
                                                historyData.latestExam.percentage >= 60 ? 'bg-yellow-50 border border-yellow-200' :
                                                'bg-red-50 border border-red-200'
                                            }`}>
                                                <div className={`text-2xl font-bold mb-1 ${
                                                    historyData.latestExam.percentage >= 80 ? 'text-green-600' :
                                                    historyData.latestExam.percentage >= 60 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                    {historyData.latestExam.percentage}%
                                                </div>
                                                <div className="text-gray-700 text-sm">
                                                    <span className="font-semibold">{historyData.latestExam.correct}</span>/{historyData.latestExam.total} câu đúng
                                                </div>
                                            </div>
                                            <Link
                                                href={`/result/${historyData.latestExam.id}`}
                                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500 text-sm">
                                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p>Chưa có kết quả thi thử</p>
                                            <p className="text-xs mt-2">Bắt đầu thi thử để xem kết quả</p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Luyện tập Progress */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 mx-auto">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white text-center mb-2">
                                    Tiến độ luyện tập
                                </h2>
                                <p className="text-green-100 text-center text-sm">
                                    Theo dõi tiến độ 3 chương
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <Link
                                        href="/practice"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-center flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Xem tiến độ
                                    </Link>
                                    <p className="text-center text-gray-500 text-sm">
                                        Kiểm tra tiến độ từng chương
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View All History Link */}
                    <div className="text-center mt-8">
                        <Link
                            href="/history"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Xem tất cả lịch sử
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600">
                        <p className="mb-2">© 2024 Ứng dụng Thi Trắc Nghiệm Lý luận Chính trị</p>
                        <p className="text-sm">Phát triển với Next.js, TypeScript và Tailwind CSS</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}