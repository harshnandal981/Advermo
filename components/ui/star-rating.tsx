'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showHalf?: boolean;
}

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  showHalf = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handleClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFullStar = displayRating >= star;
        const isHalfStar = showHalf && !isFullStar && displayRating >= star - 0.5;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            {isFullStar ? (
              <Star
                className={cn(
                  sizeClasses[size],
                  'fill-yellow-400 text-yellow-400'
                )}
              />
            ) : isHalfStar ? (
              <div className="relative">
                <Star
                  className={cn(sizeClasses[size], 'text-yellow-400')}
                />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star
                    className={cn(
                      sizeClasses[size],
                      'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </div>
              </div>
            ) : (
              <Star
                className={cn(
                  sizeClasses[size],
                  interactive ? 'text-muted-foreground' : 'text-muted'
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
