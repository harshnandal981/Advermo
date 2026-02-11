/**
 * Anonymize a full name for public display
 * Converts "John Smith" to "John S."
 */
export function anonymizeName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return 'Anonymous';
  }

  const parts = fullName.trim().split(' ');
  
  if (parts.length === 1) {
    // Single name, return as is
    return parts[0];
  }
  
  // First name + last initial
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

/**
 * Calculate days since a date
 */
export function daysSince(date: Date | string): number {
  const now = new Date();
  const then = new Date(date);
  const diffTime = Math.abs(now.getTime() - then.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate months since a date
 */
export function monthsSince(date: Date | string): number {
  return daysSince(date) / 30;
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHr < 24) {
    return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return then.toLocaleDateString();
  }
}

/**
 * Generate a random session ID for anonymous tracking
 */
export function generateSessionId(): string {
  if (typeof window !== 'undefined') {
    // Check if sessionId already exists in localStorage
    const existingId = localStorage.getItem('advermo_session_id');
    if (existingId) {
      return existingId;
    }
    
    // Generate new session ID
    const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('advermo_session_id', newId);
    return newId;
  }
  
  // Server-side or fallback
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get badge display properties
 */
export function getBadgeProperties(badge: string): {
  label: string;
  emoji: string;
  color: string;
  gradient: string;
} {
  const badges: Record<string, any> = {
    popular: {
      label: 'Popular This Week',
      emoji: '🔥',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-red-500',
    },
    rising: {
      label: 'Rising Star',
      emoji: '📈',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-500',
    },
    top_rated: {
      label: 'Top Rated',
      emoji: '⭐',
      color: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-amber-500',
    },
    quick_response: {
      label: 'Quick Response',
      emoji: '⚡',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-indigo-500',
    },
    verified: {
      label: 'Verified',
      emoji: '✓',
      color: 'bg-blue-600',
      gradient: 'from-blue-600 to-indigo-600',
    },
    best_value: {
      label: 'Best Value',
      emoji: '🏆',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-pink-500',
    },
  };

  return badges[badge] || {
    label: badge,
    emoji: '',
    color: 'bg-gray-500',
    gradient: 'from-gray-500 to-gray-600',
  };
}
