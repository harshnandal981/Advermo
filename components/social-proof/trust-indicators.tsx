'use client';

import { Zap, CheckCircle, Calendar, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustIndicator {
  icon: React.ReactNode;
  label: string;
  value: string;
  tooltip?: string;
}

interface TrustIndicatorsProps {
  responseTime?: number;
  acceptanceRate?: number;
  memberSince?: Date | string;
  totalBookings?: number;
  averageRating?: number;
  showAll?: boolean;
  className?: string;
}

/**
 * TrustIndicators Component
 * Displays trust metrics for a user/venue
 */
export function TrustIndicators({
  responseTime,
  acceptanceRate,
  memberSince,
  totalBookings,
  averageRating,
  showAll = false,
  className,
}: TrustIndicatorsProps) {
  const indicators: TrustIndicator[] = [];

  // Response time
  if (responseTime !== undefined) {
    let label = 'Responds quickly';
    if (responseTime < 1) label = 'Responds in 30 min';
    else if (responseTime < 2) label = `Responds in ${responseTime} ${responseTime === 1 ? 'hour' : 'hours'}`;
    else if (responseTime < 24) label = `Responds in ${Math.round(responseTime)} hours`;
    
    indicators.push({
      icon: <Zap className="w-4 h-4" />,
      label,
      value: '',
      tooltip: 'Average response time to inquiries',
    });
  }

  // Acceptance rate
  if (acceptanceRate !== undefined && acceptanceRate > 0) {
    indicators.push({
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Acceptance rate',
      value: `${Math.round(acceptanceRate)}%`,
      tooltip: 'Percentage of booking requests accepted',
    });
  }

  // Member since
  if (memberSince) {
    const year = new Date(memberSince).getFullYear();
    indicators.push({
      icon: <Calendar className="w-4 h-4" />,
      label: 'Member since',
      value: year.toString(),
      tooltip: 'Year joined the platform',
    });
  }

  // Total bookings
  if (totalBookings !== undefined && totalBookings > 0) {
    indicators.push({
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'Bookings hosted',
      value: `${totalBookings}+`,
      tooltip: 'Total number of successful bookings',
    });
  }

  // Average rating
  if (averageRating !== undefined && averageRating > 0) {
    indicators.push({
      icon: <Star className="w-4 h-4 fill-current" />,
      label: 'Rating',
      value: averageRating.toFixed(1),
      tooltip: 'Average rating from clients',
    });
  }

  if (indicators.length === 0) return null;

  const displayedIndicators = showAll ? indicators : indicators.slice(0, 3);

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {displayedIndicators.map((indicator, index) => (
        <div
          key={index}
          className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
          title={indicator.tooltip}
        >
          <span className="text-indigo-600 dark:text-indigo-400">
            {indicator.icon}
          </span>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {indicator.label}
          </span>
          {indicator.value && (
            <span className="text-gray-900 dark:text-white font-semibold">
              {indicator.value}
            </span>
          )}
          
          {indicator.tooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {indicator.tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
