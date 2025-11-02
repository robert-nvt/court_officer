import React from 'react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/questions';

interface TimerProps {
  timeLeft: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Timer({ timeLeft, className, size = 'md' }: TimerProps) {
  const isRunningOut = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg border-2 font-mono font-semibold',
      isCritical
        ? 'bg-red-100 border-red-500 text-red-700'
        : isRunningOut
        ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
        : 'bg-blue-50 border-blue-200 text-blue-700',
      sizeClasses[size],
      className
    )}>
      <svg
        className={cn('flex-shrink-0', iconSizes[size])}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime(timeLeft)}</span>

      {isCritical && (
        <span className="ml-1 animate-pulse">⚠️</span>
      )}
    </div>
  );
}

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  className?: string;
}

export function TimerDisplay({ timeLeft, totalTime, className }: TimerDisplayProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isRunningOut = percentage <= 20;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Thời gian còn lại</span>
        <span className={cn(
          'text-sm font-mono font-semibold',
          isRunningOut ? 'text-red-600' : 'text-gray-700'
        )}>
          {formatTime(timeLeft)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            'h-2 rounded-full transition-all duration-1000 ease-linear',
            isRunningOut
              ? 'bg-red-500 animate-pulse'
              : percentage <= 50
              ? 'bg-yellow-500'
              : 'bg-green-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}