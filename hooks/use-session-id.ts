'use client';

import { useState, useEffect } from 'react';
import { generateSessionId } from '@/lib/social-proof/helpers';

/**
 * Hook to get or create a session ID for anonymous tracking
 * Session ID persists across page refreshes via localStorage
 */
export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const id = generateSessionId();
    setSessionId(id);
  }, []);

  return sessionId;
}
