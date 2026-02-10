'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/ui/star-rating';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  spaceId: string;
  onSuccess?: () => void;
  className?: string;
}

export default function ReviewForm({ spaceId, onSuccess, className }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const characterCount = comment.length;
  const maxCharacters = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className={cn('p-6 rounded-xl bg-card border text-center', className)}>
        <p className="text-muted-foreground">
          Please sign in to leave a review
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="p-6 rounded-xl bg-card border space-y-4">
        <h3 className="text-xl font-semibold">Write a Review</h3>

        {/* Star Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Your Rating <span className="text-destructive">*</span>
          </label>
          <StarRating
            rating={rating}
            size="lg"
            interactive
            onChange={setRating}
            showHalf={false}
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="text-sm font-medium mb-2 block">
            Your Review (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this ad space..."
            maxLength={maxCharacters}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex justify-between items-center mt-1">
            <span
              className={cn(
                'text-xs',
                characterCount > maxCharacters * 0.9
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              )}
            >
              {characterCount}/{maxCharacters} characters
            </span>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
