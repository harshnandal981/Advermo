'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrgencyBannerProps {
  availableSlots?: number;
  message?: string;
  variant?: 'limited' | 'high-demand' | 'selling-fast';
  className?: string;
}

/**
 * UrgencyBanner Component
 * Creates urgency for booking decisions
 */
export function UrgencyBanner({
  availableSlots,
  message,
  variant = 'limited',
  className,
}: UrgencyBannerProps) {
  if (!message && !availableSlots) return null;

  const defaultMessages = {
    limited: availableSlots ? `Only ${availableSlots} slot${availableSlots > 1 ? 's' : ''} left this month!` : null,
    'high-demand': 'High demand - Book soon!',
    'selling-fast': 'Selling fast - Reserve your spot now!',
  };

  const displayMessage = message || defaultMessages[variant];

  if (!displayMessage) return null;

  const colors = {
    limited: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
    'high-demand': 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    'selling-fast': 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg border animate-pulse',
        colors[variant],
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">{displayMessage}</span>
    </div>
  );
}
