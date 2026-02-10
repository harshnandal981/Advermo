'use client';

import { useState, useEffect } from 'react';
import { ReviewStats } from '@/types';
import StarRating from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

interface ReviewSummaryProps {
  spaceId: string;
  onWriteReview?: () => void;
}

export default function ReviewSummary({ spaceId, onWriteReview }: ReviewSummaryProps) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/reviews/stats?spaceId=${spaceId}`);
        const data = await response.json();

        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching review stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [spaceId]);

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-card border animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="p-6 rounded-xl bg-card border space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
              <div>
                <StarRating rating={averageRating} size="md" />
                <p className="text-sm text-muted-foreground mt-1">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {onWriteReview && (
          <button
            onClick={onWriteReview}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {totalReviews > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold mb-3">Rating Distribution</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star as keyof typeof ratingDistribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12">
                  {star} star{star !== 1 && 's'}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all',
                      star >= 4 ? 'bg-green-500' : star >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
