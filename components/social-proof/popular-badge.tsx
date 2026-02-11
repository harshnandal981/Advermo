'use client';

import { cn } from '@/lib/utils';
import { getBadgeProperties } from '@/lib/social-proof/helpers';
import type { BadgeType } from '@/types';

interface PopularBadgeProps {
  badge: BadgeType;
  variant?: 'overlay' | 'inline';
  className?: string;
}

/**
 * PopularBadge Component
 * Displays trending/popular badges on space cards
 */
export function PopularBadge({
  badge,
  variant = 'overlay',
  className,
}: PopularBadgeProps) {
  const { label, emoji, gradient } = getBadgeProperties(badge);

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute top-2 left-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg backdrop-blur-sm z-10',
          `bg-gradient-to-r ${gradient}`,
          className
        )}
      >
        <span className="mr-1">{emoji}</span>
        {label}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-md',
        `bg-gradient-to-r ${gradient}`,
        className
      )}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}
