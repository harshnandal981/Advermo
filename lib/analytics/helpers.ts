import { Booking, AdSpace, ChartDataPoint, TopSpace } from '@/types';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, parseISO, differenceInDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

/**
 * Aggregate revenue by date period
 */
export function aggregateRevenueByDate(
  bookings: Booking[],
  groupBy: 'day' | 'week' | 'month' = 'day'
): ChartDataPoint[] {
  const revenueMap = new Map<string, number>();

  // Filter only paid bookings
  const paidBookings = bookings.filter(b => b.isPaid);

  paidBookings.forEach(booking => {
    const date = typeof booking.paidAt === 'string' 
      ? parseISO(booking.paidAt) 
      : booking.paidAt || new Date();
    
    let key: string;
    
    if (groupBy === 'day') {
      key = format(startOfDay(date), 'yyyy-MM-dd');
    } else if (groupBy === 'week') {
      key = format(startOfWeek(date), 'yyyy-MM-dd');
    } else {
      key = format(startOfMonth(date), 'yyyy-MM-dd');
    }

    const current = revenueMap.get(key) || 0;
    revenueMap.set(key, current + booking.totalPrice);
  });

  // Convert to array and sort by date
  return Array.from(revenueMap.entries())
    .map(([date, amount]) => ({ date, value: amount, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregate bookings by date period
 */
export function aggregateBookingsByDate(
  bookings: Booking[],
  groupBy: 'day' | 'week' | 'month' = 'day'
): ChartDataPoint[] {
  const bookingsMap = new Map<string, number>();

  bookings.forEach(booking => {
    const date = typeof booking.createdAt === 'string' 
      ? parseISO(booking.createdAt) 
      : booking.createdAt || new Date();
    
    let key: string;
    
    if (groupBy === 'day') {
      key = format(startOfDay(date), 'yyyy-MM-dd');
    } else if (groupBy === 'week') {
      key = format(startOfWeek(date), 'yyyy-MM-dd');
    } else {
      key = format(startOfMonth(date), 'yyyy-MM-dd');
    }

    const current = bookingsMap.get(key) || 0;
    bookingsMap.set(key, current + 1);
  });

  // Convert to array and sort by date
  return Array.from(bookingsMap.entries())
    .map(([date, count]) => ({ date, value: count, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate percentage growth between two values
 */
export function calculateGrowth(
  current: number,
  previous: number
): { value: number; trend: 'up' | 'down' | 'neutral' } {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, trend: current > 0 ? 'up' : 'neutral' };
  }

  const percentageChange = ((current - previous) / previous) * 100;
  
  let trend: 'up' | 'down' | 'neutral';
  if (percentageChange > 0) {
    trend = 'up';
  } else if (percentageChange < 0) {
    trend = 'down';
  } else {
    trend = 'neutral';
  }

  return {
    value: Math.abs(percentageChange),
    trend,
  };
}

/**
 * Calculate occupancy rate for a given period
 */
export function calculateOccupancyRate(
  bookings: Booking[],
  totalDays: number
): number {
  if (totalDays === 0) return 0;

  // Calculate total booked days (sum of durations)
  const bookedDays = bookings
    .filter(b => b.status !== 'cancelled' && b.status !== 'rejected')
    .reduce((sum, booking) => sum + booking.duration, 0);

  return (bookedDays / totalDays) * 100;
}

/**
 * Generate occupancy heatmap data
 */
export function generateOccupancyHeatmap(
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): ChartDataPoint[] {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    
    // Count bookings active on this day
    const activeBookings = bookings.filter(booking => {
      const bookingStart = typeof booking.startDate === 'string' 
        ? parseISO(booking.startDate) 
        : booking.startDate;
      const bookingEnd = typeof booking.endDate === 'string' 
        ? parseISO(booking.endDate) 
        : booking.endDate;
      
      return (
        (booking.status === 'confirmed' || booking.status === 'active' || booking.status === 'completed') &&
        bookingStart <= dayEnd && 
        bookingEnd >= dayStart
      );
    });

    // Simple occupancy rate: if there's at least one booking, it's considered occupied
    const occupancyRate = activeBookings.length > 0 ? 100 : 0;
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      value: occupancyRate,
      rate: occupancyRate,
    };
  });
}

/**
 * Get top performing spaces by revenue
 */
export function getTopPerformingSpaces(
  spaces: AdSpace[],
  bookings: Booking[],
  limit: number = 5
): TopSpace[] {
  const spaceMetrics = new Map<string, {
    space: AdSpace;
    revenue: number;
    bookingCount: number;
    totalDays: number;
  }>();

  // Calculate metrics for each space
  bookings.forEach(booking => {
    const spaceId = booking.spaceId;
    const space = spaces.find(s => s.id === spaceId);
    
    if (!space) return;

    const current = spaceMetrics.get(spaceId) || {
      space,
      revenue: 0,
      bookingCount: 0,
      totalDays: 0,
    };

    if (booking.isPaid) {
      current.revenue += booking.totalPrice;
    }
    
    if (booking.status !== 'cancelled' && booking.status !== 'rejected') {
      current.bookingCount += 1;
      current.totalDays += booking.duration;
    }

    spaceMetrics.set(spaceId, current);
  });

  // Convert to array and calculate occupancy rate
  const spacesArray = Array.from(spaceMetrics.values()).map(metric => {
    // Simplified occupancy calculation (can be enhanced based on actual availability)
    const avgBookingDuration = metric.totalDays / (metric.bookingCount || 1);
    const occupancyRate = Math.min((metric.totalDays / 365) * 100, 100); // Rough estimate

    return {
      space: metric.space,
      revenue: metric.revenue,
      bookingCount: metric.bookingCount,
      occupancyRate,
      averageRating: metric.space.rating || metric.space.averageRating || 0,
    };
  });

  // Sort by revenue and return top N
  return spacesArray
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/**
 * Calculate average booking value
 */
export function calculateAverageBookingValue(bookings: Booking[]): number {
  const paidBookings = bookings.filter(b => b.isPaid);
  
  if (paidBookings.length === 0) return 0;
  
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  return totalRevenue / paidBookings.length;
}

/**
 * Calculate average campaign duration
 */
export function calculateAverageDuration(bookings: Booking[]): number {
  const validBookings = bookings.filter(
    b => b.status !== 'cancelled' && b.status !== 'rejected'
  );
  
  if (validBookings.length === 0) return 0;
  
  const totalDuration = validBookings.reduce((sum, b) => sum + b.duration, 0);
  return totalDuration / validBookings.length;
}

/**
 * Calculate conversion rate (bookings to views ratio)
 * Note: This is a placeholder - actual implementation would need view tracking
 */
export function calculateConversionRate(
  bookings: Booking[],
  views: number
): number {
  if (views === 0) return 0;
  
  const confirmedBookings = bookings.filter(
    b => b.status !== 'cancelled' && b.status !== 'rejected'
  ).length;
  
  return (confirmedBookings / views) * 100;
}

/**
 * Filter bookings by date range
 */
export function filterBookingsByDateRange(
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): Booking[] {
  return bookings.filter(booking => {
    const createdAt = typeof booking.createdAt === 'string' 
      ? parseISO(booking.createdAt) 
      : booking.createdAt;
    
    return createdAt >= startDate && createdAt <= endDate;
  });
}

/**
 * Get ad format distribution
 */
export function getAdFormatDistribution(
  bookings: Booking[],
  spaces: AdSpace[]
): Array<{ format: string; count: number; revenue: number }> {
  const formatMap = new Map<string, { count: number; revenue: number }>();

  bookings.forEach(booking => {
    const space = spaces.find(s => s.id === booking.spaceId);
    if (!space) return;

    const format = space.type;
    const current = formatMap.get(format) || { count: 0, revenue: 0 };
    
    current.count += 1;
    if (booking.isPaid) {
      current.revenue += booking.totalPrice;
    }

    formatMap.set(format, current);
  });

  return Array.from(formatMap.entries()).map(([format, data]) => ({
    format,
    count: data.count,
    revenue: data.revenue,
  }));
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN')}`;
}

/**
 * Format number with abbreviation (K, M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
