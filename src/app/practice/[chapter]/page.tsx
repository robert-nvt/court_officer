'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { Timer } from '@/components/Timer';
import { getCorrectAnswer } from '@/lib/questions';

export default function QuizPage() {
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
    restartPractice,
  } = useQuiz();

  const chapter = params.chapter as string;
  const isExam = chapter === 'exam';
  const [progressLoaded, setProgressLoaded] = React.useState(false);

  useEffect(() => {
    // If quiz hasn't been started, redirect to practice page
    if (state.questions.length === 0) {
      if (isExam) {
        router.push('/practice/exam');
      } else {
        router.push('/practice');
      }
    }
  }, [state.questions.length, router, isExam]);

  // Check if existing progress was loaded
  useEffect(() => {
    if (!isExam && state.questions.length > 0 && Object.keys(state.userAnswers).length > 0 && !progressLoaded) {
      setProgressLoaded(true);
      console.log('Progress loaded with answers:', Object.keys(state.userAnswers).length, 'answers');
    }
  }, [state.userAnswers, state.questions.length, isExam, progressLoaded]);

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
  const correctAnswer = getCorrectAnswer(currentQuestion.id);
  const showResult = !!selectedAnswer && !isExam; // Only show result for practice mode when answer is selected

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

  const handleRestart = () => {
    if (isExam) {
      router.push('/practice/exam');
    } else {
      restartPractice();
    }
  };

  const handleContinueHistory = () => {
    // Navigate to history page
    router.push('/history');
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
                <h1 className="text-xl font-bold text-gray-900">
                  {isExam ? 'Thi thử' : `Luyện tập - Chương ${state.chapter}`}
                </h1>
                <p className="text-sm text-gray-600">
                  {isExam ? '60 câu hỏi ngẫu nhiên - 60 phút' : `Chương ${state.chapter} - Luyện tập không giới hạn thời gian`}
                </p>
              </div>
            </div>
            {isExam && (
              <Timer timeLeft={state.timeLeft} size="md" />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Notification */}
        {progressLoaded && !isExam && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-blue-800 font-medium">Đã tải lại tiến độ học tập!</p>
                <p className="text-blue-700 text-sm">
                  Bạn đã trả lời {Object.keys(state.userAnswers).length}/{state.questions.length} câu trong lần học trước.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            currentIndex={state.currentQuestionIndex}
            total={state.questions.length}
            answered={state.userAnswers}
            questions={state.questions}
            onQuestionClick={goToQuestion}
            showResults={!isExam} // Only show results for practice mode
            getCorrectAnswer={getCorrectAnswer}
          />
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
            correctAnswer={correctAnswer}
          />
        </div>

        {/* Result Feedback for Practice Mode */}
        {showResult && !isExam && (
          <div className={`mb-8 p-4 rounded-lg border-2 ${
            selectedAnswer === correctAnswer
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                selectedAnswer === correctAnswer
                  ? 'bg-green-600'
                  : 'bg-red-600'
              }`}>
                {selectedAnswer === correctAnswer ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${
                  selectedAnswer === correctAnswer
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {selectedAnswer === correctAnswer ? 'Chính xác!' : 'Chưa chính xác!'}
                </p>
                <p className={`text-sm mt-1 ${
                  selectedAnswer === correctAnswer
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {selectedAnswer === correctAnswer
                    ? 'Bạn đã chọn đúng đáp án.'
                    : `Đáp án đúng là ${correctAnswer}.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

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

              {/* Additional Controls for Practice Mode */}
        {!isExam && (
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {/* Practice Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê luyện tập</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đã trả lời:</span>
                  <span className="font-semibold text-blue-600">
                    {Object.keys(state.userAnswers).length}/{state.questions.length} câu
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                  <span className="font-semibold text-blue-600">
                    {Math.round((Object.keys(state.userAnswers).length / state.questions.length) * 100)}%
                  </span>
                </div>
                {Object.keys(state.userAnswers).length > 0 && (
                  <div className="pt-3 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Xem kết quả hoàn chỉnh
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRestart}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa tiến độ & làm lại
                </button>
                <button
                  onClick={handleContinueHistory}
                  className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Xem lịch sử
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button for Exam Mode */}
        {isExam && Object.keys(state.userAnswers).length > 0 && (
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

        </main>
    </div>
  );
}