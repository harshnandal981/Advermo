import { daysSince } from './helpers';
import type { TrustScore } from '@/types';

interface UserTrustData {
  emailVerified?: Date;
  phoneVerified?: Date;
  isVerified?: boolean;
  verificationType?: 'email' | 'phone' | 'identity' | 'business';
  responseTime?: number;
  acceptanceRate?: number;
  createdAt: Date;
  totalBookingsHosted?: number;
  totalBookingsMade?: number;
  rating?: number;
}

/**
 * Calculate comprehensive trust score for a user
 * Score ranges from 0-100
 */
export function calculateTrustScore(user: UserTrustData): TrustScore {
  const breakdown = {
    emailVerified: 0,
    phoneVerified: 0,
    identityVerified: 0,
    businessVerified: 0,
    responseTime: 0,
    acceptanceRate: 0,
    accountAge: 0,
    bookingHistory: 0,
    averageRating: 0,
  };

  // Email verification: +10 points
  if (user.emailVerified) {
    breakdown.emailVerified = 10;
  }

  // Phone verification: +10 points
  if (user.phoneVerified) {
    breakdown.phoneVerified = 10;
  }

  // Identity/Business verification
  if (user.isVerified && user.verificationType) {
    if (user.verificationType === 'identity') {
      breakdown.identityVerified = 20;
    } else if (user.verificationType === 'business') {
      breakdown.businessVerified = 25;
    }
  }

  // Response time scoring
  if (user.responseTime !== undefined) {
    if (user.responseTime < 1) {
      breakdown.responseTime = 20;
    } else if (user.responseTime < 2) {
      breakdown.responseTime = 15;
    } else if (user.responseTime < 4) {
      breakdown.responseTime = 10;
    } else if (user.responseTime < 24) {
      breakdown.responseTime = 5;
    }
  }

  // Acceptance rate scoring
  if (user.acceptanceRate !== undefined) {
    if (user.acceptanceRate >= 90) {
      breakdown.acceptanceRate = 15;
    } else if (user.acceptanceRate >= 80) {
      breakdown.acceptanceRate = 10;
    } else if (user.acceptanceRate >= 70) {
      breakdown.acceptanceRate = 5;
    }
  }

  // Account age scoring
  const monthsOld = daysSince(user.createdAt) / 30;
  if (monthsOld >= 24) {
    breakdown.accountAge = 10;
  } else if (monthsOld >= 12) {
    breakdown.accountAge = 8;
  } else if (monthsOld >= 6) {
    breakdown.accountAge = 5;
  } else if (monthsOld >= 3) {
    breakdown.accountAge = 3;
  }

  // Booking history scoring
  const totalBookings = (user.totalBookingsHosted || 0) + (user.totalBookingsMade || 0);
  if (totalBookings >= 50) {
    breakdown.bookingHistory = 15;
  } else if (totalBookings >= 20) {
    breakdown.bookingHistory = 10;
  } else if (totalBookings >= 10) {
    breakdown.bookingHistory = 5;
  } else if (totalBookings >= 5) {
    breakdown.bookingHistory = 3;
  }

  // Average rating scoring
  if (user.rating !== undefined && user.rating > 0) {
    if (user.rating >= 4.8) {
      breakdown.averageRating = 10;
    } else if (user.rating >= 4.5) {
      breakdown.averageRating = 7;
    } else if (user.rating >= 4.0) {
      breakdown.averageRating = 5;
    } else if (user.rating >= 3.5) {
      breakdown.averageRating = 3;
    }
  }

  // Calculate total score
  const total = Math.min(
    Object.values(breakdown).reduce((sum, score) => sum + score, 0),
    100
  );

  return {
    total,
    breakdown,
  };
}

/**
 * Get trust level label and color based on score
 */
export function getTrustLevel(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 76) {
    return {
      label: 'Highly Trusted',
      color: 'text-green-600 dark:text-green-400',
      description: 'This user has excellent credentials and a strong track record',
    };
  } else if (score >= 51) {
    return {
      label: 'Trusted',
      color: 'text-yellow-600 dark:text-yellow-400',
      description: 'This user has good credentials and a solid history',
    };
  } else {
    return {
      label: 'Building Trust',
      color: 'text-orange-600 dark:text-orange-400',
      description: 'This user is still building their reputation',
    };
  }
}

/**
 * Calculate badge eligibility for a space
 */
export function calculateSpaceBadges(space: {
  stats?: {
    viewsThisWeek: number;
    bookingsThisWeek: number;
    totalBookings: number;
  };
  rating?: number;
  reviewCount?: number;
  owner?: {
    responseTime?: number;
  };
}): string[] {
  const badges: string[] = [];

  // Popular badge: > 20 views this week
  if (space.stats && space.stats.viewsThisWeek > 20) {
    badges.push('popular');
  }

  // Top rated: Rating > 4.7 with 10+ reviews
  if (space.rating && space.rating > 4.7 && space.reviewCount && space.reviewCount >= 10) {
    badges.push('top_rated');
  }

  // Quick response: Response time < 1 hour
  if (space.owner && space.owner.responseTime !== undefined && space.owner.responseTime < 1) {
    badges.push('quick_response');
  }

  // Rising: Bookings increased 50%+ (simplified check)
  if (space.stats && space.stats.bookingsThisWeek >= 3) {
    badges.push('rising');
  }

  return badges;
}
