import React, { useState } from 'react';
import { Result } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AnswerGridProps {
  result: Result;
  onQuestionClick?: (question: any, index: number) => void;
  className?: string;
}

export function AnswerGrid({ result, onQuestionClick, className }: AnswerGridProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-lg p-6', className)}>
      <h3 className="text-lg font-bold text-gray-900 mb-6">Bảng kết quả chi tiết</h3>

      {/* Statistics Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{result.correct}</div>
          <div className="text-sm text-green-700">Đúng</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{result.incorrect}</div>
          <div className="text-sm text-red-700">Sai</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{result.total}</div>
          <div className="text-sm text-blue-700">Tổng</div>
        </div>
      </div>

      {/* Answer Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">Click vào ô để xem chi tiết câu hỏi</span>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Đúng</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Sai</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Bỏ qua</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2 sm:grid-cols-15 md:grid-cols-20">
          {result.answers.map((answer, index) => {
            const cellColor = answer.userAnswer
              ? (answer.isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600')
              : 'bg-gray-300 hover:bg-gray-400';

            const textColor = answer.userAnswer ? 'text-white' : 'text-gray-700';

            return (
              <button
                key={index}
                onClick={() => onQuestionClick?.(answer, index)}
                className={cn(
                  'aspect-square rounded text-xs font-bold transition-all duration-200 flex items-center justify-center',
                  cellColor,
                  textColor,
                  'hover:scale-110 hover:shadow-lg cursor-pointer'
                )}
                title={`Câu ${index + 1}: ${answer.isCorrect ? 'Đúng' : 'Sai'}${!answer.userAnswer ? ' (Bỏ qua)' : ''}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: {
    question: any;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  };
  questionNumber: number;
}

export function QuestionModal({ isOpen, onClose, answer, questionNumber }: QuestionModalProps) {
  if (!isOpen) return null;

  const { question, userAnswer, correctAnswer, isCorrect } = answer;
  console.log('Modal data:', { question, userAnswer, correctAnswer, isCorrect, questionNumber });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
                isCorrect ? 'bg-green-500' : 'bg-red-500'
              )}>
                {questionNumber}
              </div>
              <h3 className="text-lg font-bold text-gray-900">Chi tiết câu hỏi</h3>
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                isCorrect
                  ? 'bg-green-100 text-green-800'
                  : userAnswer
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              )}>
                {isCorrect ? 'ĐÚNG' : userAnswer ? 'SAI' : 'BỎ QUA'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Question */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Câu hỏi:</h4>
            <p className="text-gray-700 leading-relaxed">{question.question}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Đáp án:</h4>
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = question[option as keyof typeof question] as string;
              if (!optionText) return null;

              let bgColor = 'bg-gray-50 border-gray-200';
              let textColor = 'text-gray-700';
              let icon = null;

              if (option === correctAnswer) {
                bgColor = 'bg-green-50 border-green-300';
                textColor = 'text-green-800';
                icon = (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                );
              } else if (option === userAnswer && option !== correctAnswer) {
                bgColor = 'bg-red-50 border-red-300';
                textColor = 'text-red-800';
                icon = (
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                );
              }

              return (
                <div
                  key={option}
                  className={cn(
                    'p-3 rounded-lg border-2 flex items-center gap-3',
                    bgColor,
                    textColor
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                      option === correctAnswer
                        ? 'bg-green-600 border-green-600 text-white'
                        : option === userAnswer && option !== correctAnswer
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-gray-300 text-gray-600'
                    )}>
                      {option}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{optionText}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {icon}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Answer Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Bạn chọn: </span>
                <span className={cn(
                  'font-bold ml-1',
                  userAnswer ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-500'
                )}>
                  {userAnswer || 'Không chọn'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Đáp án đúng: </span>
                <span className="font-bold text-green-600 ml-1">{correctAnswer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}