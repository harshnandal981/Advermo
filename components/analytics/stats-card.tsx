'use client';

import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/analytics/helpers';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  isCurrency?: boolean;
  isPercentage?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  isCurrency = false,
  isPercentage = false,
  loading = false,
  tooltip,
}: StatsCardProps) {
  // Format the value helper function
  const getFormattedValue = (): string | number => {
    if (loading) return '...';
    if (typeof value !== 'number') return value;
    if (isCurrency) return formatCurrency(value);
    if (isPercentage) return `${value.toFixed(1)}%`;
    return formatNumber(value);
  };

  const formattedValue = getFormattedValue();

  // Determine trend color
  const trendColor = trend === 'up' 
    ? 'text-green-600 dark:text-green-400'
    : trend === 'down'
    ? 'text-red-600 dark:text-red-400'
    : 'text-muted-foreground';

  const trendBgColor = trend === 'up' 
    ? 'bg-green-50 dark:bg-green-950'
    : trend === 'down'
    ? 'bg-red-50 dark:bg-red-950'
    : 'bg-muted';

  return (
    <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow" title={tooltip}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold">{formattedValue}</p>
          )}
        </div>
        
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {change !== undefined && !loading && (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${trendBgColor}`}>
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            <span className="font-medium">{Math.abs(change).toFixed(1)}%</span>
          </div>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
