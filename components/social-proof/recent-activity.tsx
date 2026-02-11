'use client';

import { Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/social-proof/helpers';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  lastBookedAt?: Date | string;
  className?: string;
}

/**
 * RecentActivity Component
 * Shows when a space was last booked
 */
export function RecentActivity({
  lastBookedAt,
  className,
}: RecentActivityProps) {
  if (!lastBookedAt) return null;

  const timeAgo = formatRelativeTime(lastBookedAt);

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400', className)}>
      <Clock className="w-4 h-4" />
      <span>Last booked {timeAgo}</span>
    </div>
  );
}
