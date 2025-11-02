import React from 'react';
import { Question } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  correctAnswer?: string;
  className?: string;
}

const OPTIONS = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  correctAnswer,
  className,
}: QuestionCardProps) {
  const getOptionStyle = (option: string) => {
    const baseStyle = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md';

    if (showResult && correctAnswer) {
      if (option === correctAnswer) {
        return cn(baseStyle, 'bg-green-50 border-green-500 text-green-900');
      }
      if (option === selectedAnswer && option !== correctAnswer) {
        return cn(baseStyle, 'bg-red-50 border-red-500 text-red-900');
      }
      return cn(baseStyle, 'bg-gray-50 border-gray-200 text-gray-600');
    }

    if (selectedAnswer === option) {
      return cn(baseStyle, 'bg-blue-50 border-blue-500 text-blue-900');
    }

    return cn(baseStyle, 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50');
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-6', className)}>
      {/* Question number and text */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
            {question.id.split('-')[1]}
          </span>
          <span className="text-sm font-medium text-gray-500">Câu hỏi</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer options */}
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
            className={getOptionStyle(option)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                  selectedAnswer === option && !showResult
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : showResult && option === correctAnswer
                    ? 'bg-green-600 border-green-600 text-white'
                    : showResult && option === selectedAnswer && option !== correctAnswer
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-gray-300 text-gray-600'
                )}>
                  {option}
                </div>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">
                  {question[option as keyof Question] as string}
                </p>
              </div>
              {showResult && (
                <div className="flex-shrink-0 ml-2">
                  {option === correctAnswer && (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {option === selectedAnswer && option !== correctAnswer && (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {showResult && !selectedAnswer && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Chú ý:</span> Bạn đã bỏ qua câu hỏi này.
          </p>
        </div>
      )}
    </div>
  );
}