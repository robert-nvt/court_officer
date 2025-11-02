import React from 'react';
import { Result } from '@/lib/types';
import { formatTime } from '@/lib/questions';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: Result;
  className?: string;
}

export function ResultCard({ result, className }: ResultCardProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 60) return '😊';
    if (percentage >= 50) return '😐';
    return '😔';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Xuất sắc!';
    if (percentage >= 80) return 'Rất tốt!';
    if (percentage >= 70) return 'Khá tốt!';
    if (percentage >= 60) return 'Đạt!';
    if (percentage >= 50) return 'Cần cố gắng hơn!';
    return 'Chưa đạt, hãy ôn tập thêm!';
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-6', className)}>
      {/* Score Overview */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">
          {getScoreEmoji(result.percentage)}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getScoreMessage(result.percentage)}
        </h2>
        <div className={cn('text-4xl font-bold', getScoreColor(result.percentage))}>
          {result.percentage}%
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{result.correct}</div>
          <div className="text-sm text-green-700 font-medium">Đúng</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{result.incorrect}</div>
          <div className="text-sm text-red-700 font-medium">Sai</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{result.total}</div>
          <div className="text-sm text-blue-700 font-medium">Tổng</div>
        </div>
      </div>

      {/* Time spent */}
      <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex items-center justify-center gap-2 text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Thời gian làm bài:</span>
          <span className="font-mono font-semibold">{formatTime(result.timeSpent)}</span>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Hiệu suất</span>
          <span>{result.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={cn(
              'h-3 rounded-full transition-all duration-500 ease-out',
              result.percentage >= 80
                ? 'bg-green-500'
                : result.percentage >= 60
                ? 'bg-yellow-500'
                : result.percentage >= 40
                ? 'bg-orange-500'
                : 'bg-red-500'
            )}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">Gợi ý học tập:</div>
            {result.percentage >= 80 && (
              <p>Bạn đã làm rất tốt! Hãy tiếp tục duy trì kết quả này.</p>
            )}
            {result.percentage >= 60 && result.percentage < 80 && (
              <p>Kết quả khá tốt. Hãy ôn tập lại các câu trả lời sai để cải thiện thêm.</p>
            )}
            {result.percentage >= 40 && result.percentage < 60 && (
              <p>Bạn cần cố gắng hơn. Hãy xem lại kỹ các kiến thức và làm thêm bài tập.</p>
            )}
            {result.percentage < 40 && (
              <p>Bạn cần ôn tập lại kiến thức cơ bản. Hãy xem kỹ đáp án và làm lại từ đầu.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnswerReviewProps {
  result: Result;
  onQuestionClick?: (index: number) => void;
  className?: string;
}

export function AnswerReview({ result, onQuestionClick, className }: AnswerReviewProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-6', className)}>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Chi tiết câu trả lời</h3>

      <div className="space-y-3">
        {result.answers.map((answer, index) => (
          <div
            key={index}
            onClick={() => onQuestionClick?.(index)}
            className={cn(
              'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
              answer.isCorrect
                ? 'bg-green-50 border-green-200 hover:border-green-300'
                : 'bg-red-50 border-red-200 hover:border-red-300'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Câu {index + 1}
                </span>
                {answer.isCorrect ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đúng
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Sai
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {answer.question.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-600">Bạn chọn: </span>
                <span className={cn(
                  'font-semibold',
                  answer.userAnswer ? (answer.isCorrect ? 'text-green-700' : 'text-red-700') : 'text-gray-500'
                )}>
                  {answer.userAnswer || 'Không chọn'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Đáp án đúng: </span>
                <span className="font-semibold text-green-700">
                  {answer.correctAnswer}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}