'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  isVerified?: boolean;
  verificationType?: 'email' | 'phone' | 'identity' | 'business';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

/**
 * VerifiedBadge Component
 * Displays verification status with different styles based on verification level
 */
export function VerifiedBadge({
  isVerified = false,
  verificationType = 'email',
  size = 'md',
  showTooltip = true,
  className,
}: VerifiedBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const colorClasses = {
    email: 'text-gray-500 dark:text-gray-400',
    phone: 'text-blue-500 dark:text-blue-400',
    identity: 'text-indigo-600 dark:text-indigo-400',
    business: 'text-yellow-600 dark:text-yellow-500',
  };

  const tooltipText = {
    email: 'Email Verified',
    phone: 'Phone & Email Verified',
    identity: 'Identity Verified',
    business: 'Business Verified',
  };

  return (
    <div className={cn('inline-flex items-center group relative', className)}>
      <CheckCircle2
        className={cn(
          sizeClasses[size],
          colorClasses[verificationType],
          'fill-current'
        )}
        aria-label={tooltipText[verificationType]}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          {tooltipText[verificationType]}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
