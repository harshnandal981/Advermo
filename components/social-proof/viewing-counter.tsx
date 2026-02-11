'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useViewerCount } from '@/hooks/use-viewer-count';

interface ViewingCounterProps {
  spaceId: string;
  showWhenZero?: boolean;
  className?: string;
}

/**
 * ViewingCounter Component
 * Displays real-time viewer count with polling
 */
export function ViewingCounter({
  spaceId,
  showWhenZero = false,
  className,
}: ViewingCounterProps) {
  const { count, isLoading } = useViewerCount(spaceId);
  const [prevCount, setPrevCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger pulse animation when count changes
  useEffect(() => {
    if (count !== prevCount && count > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1000);
      setPrevCount(count);
      return () => clearTimeout(timer);
    }
  }, [count, prevCount]);

  if (isLoading || (count === 0 && !showWhenZero)) {
    return null;
  }

  const isHighDemand = count > 3;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
        isHighDemand
          ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        isPulsing && 'animate-pulse',
        className
      )}
    >
      <Eye className={cn('w-4 h-4', isHighDemand && 'text-red-500')} />
      <span>
        {count} {count === 1 ? 'person' : 'people'} viewing
      </span>
      {isHighDemand && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      )}
    </div>
  );
}
