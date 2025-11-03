'use client';

import React from 'react';
import Link from 'next/link';
import { QuizHistory } from '@/lib/types';
import { formatDate, getModeLabel } from '@/lib/history';

interface HistoryCardProps {
  history: QuizHistory | null;
  type: 'practice' | 'exam';
  title: string;
  icon: React.ReactNode;
  colorClass: string;
}

export default function HistoryCard({ history, type, title, icon, colorClass }: HistoryCardProps) {
  if (!history) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-lg border border-gray-100 max-w-sm`}>
        <div className={`${colorClass} p-4`}>
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 mx-auto">
            <div className="w-6 h-6">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-bold text-white text-center mb-1">{title}</h3>
          <p className="text-white/80 text-center text-xs">Chưa có kết quả</p>
        </div>

        <div className="p-4">
          <div className="text-center text-gray-500 text-xs">
            <p>Bắt đầu thi thử để xem kết quả</p>
          </div>
        </div>
      </div>
    );
  }

  const percentageColor = history.percentage >= 80 ? 'text-green-600' :
                          history.percentage >= 60 ? 'text-yellow-600' :
                          'text-red-600';

  const percentageBg = history.percentage >= 80 ? 'bg-green-50' :
                       history.percentage >= 60 ? 'bg-yellow-50' :
                       'bg-red-50';

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-lg border border-gray-100 max-w-sm`}>
      <div className={`${colorClass} p-4`}>
        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 mx-auto">
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-bold text-white text-center mb-1">{title}</h3>
        <p className="text-white/80 text-center text-xs">
          {getModeLabel(history.mode, history.chapter)}
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {/* Thời gian */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{formatDate(history.date)}</span>
          </div>

          {/* Kết quả chính */}
          <div className={`${percentageBg} rounded-lg p-3 text-center`}>
            <div className={`text-2xl font-bold ${percentageColor} mb-1`}>
              {history.percentage}%
            </div>
            <div className="text-gray-700 text-xs">
              <span className="font-semibold">{history.correct}</span>/{history.total}
            </div>
          </div>

          {/* Chi tiết */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 rounded p-2 text-center">
              <div className="text-green-600 font-semibold">{history.correct}</div>
              <div className="text-green-700">Đúng</div>
            </div>
            <div className="bg-red-50 rounded p-2 text-center">
              <div className="text-red-600 font-semibold">{history.incorrect}</div>
              <div className="text-red-700">Sai</div>
            </div>
          </div>

          {/* Thời gian làm bài */}
          <div className="text-center text-xs text-gray-600">
            <span>{history.timeSpentFormatted}</span>
          </div>

          {/* Nút xem chi tiết */}
          <Link
            href={`/result/${history.id}`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded transition-colors duration-200 text-center text-xs"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}