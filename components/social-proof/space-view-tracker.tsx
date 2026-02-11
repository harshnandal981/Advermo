'use client';

import { useViewTracker } from '@/hooks/use-view-tracker';

interface SpaceViewTrackerProps {
  spaceId: string;
}

/**
 * SpaceViewTracker Component
 * Client-side wrapper to track space views
 */
export default function SpaceViewTracker({ spaceId }: SpaceViewTrackerProps) {
  useViewTracker(spaceId);
  return null;
}
