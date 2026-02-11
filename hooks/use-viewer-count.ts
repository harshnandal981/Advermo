'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to fetch and poll viewer count for a space
 * Polls every 30 seconds to get updated count
 */
export function useViewerCount(spaceId: string | undefined) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!spaceId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/social-proof/viewers/${spaceId}`);
        if (!res.ok) throw new Error('Failed to fetch viewer count');
        
        const data = await res.json();
        
        if (isMounted) {
          setCount(data.count || 0);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching viewer count:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch immediately
    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [spaceId]);

  return { count, isLoading };
}
