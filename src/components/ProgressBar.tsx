import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  answered: Record<string, string>;
  questions: Array<{ id: string }>;
  onQuestionClick?: (index: number) => void;
  className?: string;
}

export function ProgressBar({ currentIndex, total, answered, questions, onQuestionClick, className }: ProgressBarProps) {
  const answeredCount = Object.keys(answered).length;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress overview */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <div> <span className="text-sm font-medium text-red-700">
             EM YÊU CỐ LÊN NHÉ - IU IU - SẮP TỚI GỒI SẮP TỚI GỒI ^^
          </span></div>
          
          <span className="text-sm font-medium text-gray-700">
            Tiến độ: {answeredCount}/{total} câu đã trả lời
          </span>
          <span className="text-sm font-medium text-gray-700">
            Câu {currentIndex + 1}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(answeredCount / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Individual question indicators */}
      <div className="grid grid-cols-10 gap-1 sm:grid-cols-15 md:grid-cols-20">
        {questions.map((question, index) => {
          const questionId = question.id;
          const isAnswered = answered[questionId];
          const isCurrent = index === currentIndex;

          let bgClass = 'bg-gray-200'; // Default: not answered
          let borderClass = 'border-gray-200';
          let textClass = 'text-gray-600';

          if (isCurrent) {
            bgClass = 'bg-yellow-400'; // Current question: yellow
            borderClass = 'border-yellow-500';
            textClass = 'text-yellow-900';
          } else if (isAnswered) {
            bgClass = 'bg-green-500'; // Answered: green
            borderClass = 'border-green-600';
            textClass = 'text-white';
          }

          return (
            <button
              key={index}
              onClick={() => onQuestionClick?.(index)}
              className={cn(
                'aspect-square rounded-full border-2 transition-all duration-200 flex items-center justify-center text-xs font-medium',
                bgClass,
                borderClass,
                textClass,
                onQuestionClick
                  ? 'hover:scale-110 cursor-pointer hover:shadow-lg'
                  : 'cursor-default'
              )}
              title={`Câu ${index + 1}${isAnswered ? ' (Đã trả lời)' : ''}${isCurrent ? ' (Hiện tại)' : ''}${onQuestionClick ? ' - Click để đến câu này' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Đã làm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Hiện tại</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span>Chưa làm</span>
          </div>
        </div>
        {onQuestionClick && (
          <div className="flex items-center gap-1 text-blue-600 font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
            </svg>
            <span>Click vào số câu để chuyển</span>
          </div>
        )}
      </div>
    </div>
  );
}