'use client';

import { Review } from '@/types';
import StarRating from '@/components/ui/star-rating';
import { Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  const isVerified = review.userRole === 'venue'; // Venue owners are verified

  return (
    <div className="p-6 rounded-xl bg-card border space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{review.userName}</h4>
              {isVerified && (
                <Shield className="h-4 w-4 text-primary" title="Verified User" />
              )}
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {review.userRole}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-sm text-muted-foreground">{timeAgo}</span>
      </div>

      {/* Rating */}
      <div>
        <StarRating rating={review.rating} size="sm" showHalf={false} />
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
