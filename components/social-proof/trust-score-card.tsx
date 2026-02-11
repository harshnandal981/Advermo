'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getTrustLevel } from '@/lib/social-proof/trust-score';

interface TrustScoreCardProps {
  userId: string;
  showBreakdown?: boolean;
  className?: string;
}

/**
 * TrustScoreCard Component
 * Visual trust score display with circular progress
 */
export function TrustScoreCard({
  userId,
  showBreakdown = false,
  className,
}: TrustScoreCardProps) {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch(`/api/social-proof/trust-score/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch trust score');
        
        const data = await res.json();
        setScore(data.score);
        setBreakdown(data.breakdown);
      } catch (error) {
        console.error('Error fetching trust score:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  if (isLoading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  const trustLevel = getTrustLevel(score);
  const percentage = score;

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6', className)}>
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className={cn(
                'transition-all duration-1000',
                score >= 76 && 'text-green-500',
                score >= 51 && score < 76 && 'text-yellow-500',
                score < 51 && 'text-orange-500'
              )}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {score}
            </span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1">
          <h3 className={cn('text-lg font-semibold mb-1', trustLevel.color)}>
            {trustLevel.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {trustLevel.description}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && breakdown && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
            Score Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(breakdown).map(([key, value]: [string, any]) => {
              if (value === 0) return null;
              
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-medium text-gray-900 dark:text-white">+{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
