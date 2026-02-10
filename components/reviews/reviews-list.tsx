'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import ReviewCard from './review-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewsListProps {
  spaceId: string;
  initialSort?: 'newest' | 'highest';
}

export default function ReviewsList({ spaceId, initialSort = 'newest' }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reviews?spaceId=${spaceId}&sort=${sort}&page=${page}&limit=10`
      );
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [spaceId, sort, page]);

  const handleSortChange = (newSort: 'newest' | 'highest') => {
    setSort(newSort);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      setPage(page + 1);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-card border animate-pulse"
          >
            <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && reviews.length === 0) {
    return (
      <div className="p-12 rounded-xl bg-card border text-center">
        <p className="text-muted-foreground text-lg">
          No reviews yet. Be the first to review this ad space!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Dropdown */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Reviews ({pagination.total})
        </h3>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value as 'newest' | 'highest')}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!pagination.hasMore}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
