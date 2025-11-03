'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuiz } from '@/contexts/QuizContext';
import { getChapterProgress } from '@/lib/history';
import { getChapterQuestions } from '@/lib/questions';

const CHAPTERS = [
  {
    id: 1,
    title: 'Chương 1: Hiến pháp 2013',
    description: 'Nội dung về Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013',
    questionCount: 221,
    color: 'blue',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Chương 2: Luật Cán bộ, công chức',
    description: 'Luật Cán bộ, công chức số 80/2025/QH15',
    questionCount: 'Nhiều',
    color: 'green',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Chương 3: Luật Tổ chức Tòa án nhân dân',
    description: 'Luật Tổ chức Tòa án nhân dân số 34/2024/QH15',
    questionCount: 'Nhiều',
    color: 'purple',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
];

export default function PracticePage() {
  const { startPractice } = useQuiz();
  const [chaptersProgress, setChaptersProgress] = useState<Record<number, any>>({});

  useEffect(() => {
    // Load progress for all chapters
    const loadProgress = async () => {
      const progress: Record<number, any> = {};

      for (const chapter of CHAPTERS) {
        try {
          const chapterProgress = getChapterProgress(chapter.id);
          const questions = getChapterQuestions(chapter.id);

          progress[chapter.id] = {
            progress: chapterProgress,
            totalQuestions: questions.length
          };
        } catch (error) {
          console.error(`Error loading progress for chapter ${chapter.id}:`, error);
          progress[chapter.id] = {
            progress: null,
            totalQuestions: 0
          };
        }
      }

      setChaptersProgress(progress);
    };

    loadProgress();
  }, []);

  const handleChapterSelect = (chapterId: number) => {
    startPractice(chapterId);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          hover: 'hover:bg-blue-600',
          light: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          progress: 'bg-blue-600',
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          hover: 'hover:bg-green-600',
          light: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          progress: 'bg-green-600',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          hover: 'hover:bg-purple-600',
          light: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
          progress: 'bg-purple-600',
        };
      default:
        return {
          bg: 'bg-gray-500',
          hover: 'hover:bg-gray-600',
          light: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          iconBg: 'bg-gray-100',
          progress: 'bg-gray-600',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Luyện tập theo chương</h1>
              <p className="text-gray-600 mt-1">Chọn chương bạn muốn ôn tập</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Về trang chủ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHAPTERS.map((chapter) => {
            const colors = getColorClasses(chapter.color);
            return (
              <div
                key={chapter.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Chapter Header */}
                <div className={`${colors.bg} p-6`}>
                  <div className={`flex items-center justify-center w-16 h-16 ${colors.iconBg} rounded-full mb-4 mx-auto`}>
                    <div className={colors.text}>
                      {chapter.icon}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white text-center mb-2">
                    {chapter.title}
                  </h2>
                  <p className="text-white/80 text-center text-sm">
                    {chapter.description}
                  </p>
                </div>

                {/* Chapter Content */}
                <div className="p-6">
                  {/* Progress Display */}
                  {chaptersProgress[chapter.id]?.progress && (
                    <div className={`p-4 ${colors.light} rounded-lg mb-4`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">Tiến độ</span>
                          <span className={`font-bold ${colors.text}`}>
                            {chaptersProgress[chapter.id].progress.totalAnswered}/{chaptersProgress[chapter.id].totalQuestions} câu
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors.progress}`}
                            style={{
                              width: `${(chaptersProgress[chapter.id].progress.totalAnswered / chaptersProgress[chapter.id].totalQuestions) * 100}%`
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">
                              Đúng: {chaptersProgress[chapter.id].progress.correctAnswers}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-gray-600">
                              Sai: {chaptersProgress[chapter.id].progress.incorrectAnswers}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`p-4 ${colors.light} rounded-lg mb-6`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Tổng số câu hỏi</span>
                      <span className={`font-bold ${colors.text}`}>
                        {chaptersProgress[chapter.id]?.totalQuestions ||
                         (typeof chapter.questionCount === 'number'
                           ? chapter.questionCount
                           : 'Nhiều')} câu
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Luyện tập không giới hạn thời gian</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Kiểm tra đáp án ngay lập tức</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Xem lại kết quả chi tiết</span>
                    </div>
                  </div>

                  <Link
                    href={`/practice/${chapter.id}`}
                    onClick={() => handleChapterSelect(chapter.id)}
                    className={`w-full ${colors.bg} ${colors.hover} text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Bắt đầu luyện tập
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Study Tips */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Gợi ý học tập hiệu quả</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Học theo chương</h3>
              <p className="text-gray-600 text-sm">Tập trung ôn tập từng chương để nắm vững kiến thức cơ bản</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Luyện tập thường xuyên</h3>
              <p className="text-gray-600 text-sm">Dành thời gian đều đặn mỗi ngày để củng cố kiến thức</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thi thử định kỳ</h3>
              <p className="text-gray-600 text-sm">Kiểm tra kiến thức tổng hợp qua các bài thi thử</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}