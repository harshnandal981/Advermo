'use client';

import { useEffect, useRef } from 'react';
import { generateSessionId } from '@/lib/social-proof/helpers';

/**
 * Hook to track space views with automatic heartbeat
 * Updates view counter every 30 seconds to maintain active viewer status
 */
export function useViewTracker(spaceId: string | undefined) {
  const sessionIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!spaceId) return;

    // Generate or get session ID
    if (!sessionIdRef.current) {
      sessionIdRef.current = generateSessionId();
    }

    const sessionId = sessionIdRef.current;

    // Track initial view
    const trackView = async () => {
      try {
        await fetch('/api/social-proof/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spaceId, sessionId }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track view immediately
    trackView();

    // Update "last seen" every 30 seconds
    intervalRef.current = setInterval(() => {
      trackView();
    }, 30000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [spaceId]);
}
