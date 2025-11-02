'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { Timer } from '@/components/Timer';

export default function ExamQuizPage() {
  const params = useParams();
  const router = useRouter();
  const {
    state,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    answerQuestion,
    completeQuiz,
    isFirstQuestion,
    isLastQuestion,
    startExam,
  } = useQuiz();

  useEffect(() => {
    // Start exam if not already started
    if (state.questions.length === 0) {
      startExam();
    }
  }, [state.questions.length, startExam]);

  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const selectedAnswer = state.userAnswers[currentQuestion.id];

  const handleSubmit = () => {
    completeQuiz();
    router.push('/result');
  };

  const handleAnswerSelect = (answer: string) => {
    answerQuestion(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (isLastQuestion()) {
      handleSubmit();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thi thử</h1>
                <p className="text-sm text-gray-600">60 câu hỏi ngẫu nhiên - 60 phút</p>
              </div>
            </div>
            <Timer timeLeft={state.timeLeft} size="md" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            currentIndex={state.currentQuestionIndex}
            total={state.questions.length}
            answered={state.userAnswers}
            questions={state.questions}
            onQuestionClick={goToQuestion}
          />
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Câu trước
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Câu</span>
            <span className="font-bold text-blue-600">{state.currentQuestionIndex + 1}</span>
            <span>/</span>
            <span className="font-bold">{state.questions.length}</span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {isLastQuestion() ? 'Nộp bài' : 'Câu tiếp theo'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Submit Button */}
        {Object.keys(state.userAnswers).length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nộp bài
            </button>
            <p className="mt-2 text-sm text-gray-600">
              Đã trả lời {Object.keys(state.userAnswers).length}/{state.questions.length} câu hỏi
            </p>
          </div>
        )}

        {/* Timer Display */}
        <div className="mt-12">
          <TimerDisplay timeLeft={state.timeLeft} totalTime={60 * 60} />
        </div>
      </main>
    </div>
  );
}

function TimerDisplay({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const percentage = (timeLeft / totalTime) * 100;
  const isRunningOut = percentage <= 20;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thời gian còn lại</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-mono font-bold text-gray-900">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
        <span className={`text-sm font-medium ${isRunningOut ? 'text-red-600' : 'text-gray-600'}`}>
          {isRunningOut ? '⚠️ Sắp hết giờ!' : 'Còn thời gian'}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-linear ${
            isRunningOut
              ? 'bg-red-500 animate-pulse'
              : percentage <= 50
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}