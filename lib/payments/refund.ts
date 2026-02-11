import { differenceInDays } from 'date-fns';
import { Booking } from '@/types';

/**
 * Calculates refund amount based on cancellation date
 * @param booking - The booking to calculate refund for
 * @param cancelDate - The date of cancellation
 * @returns number - Refund amount in the same currency as booking
 */
export function calculateRefundAmount(
  booking: Booking,
  cancelDate: Date = new Date()
): number {
  const startDate = new Date(booking.startDate);
  const daysUntilStart = differenceInDays(startDate, cancelDate);

  // Full refund if cancelled 7+ days before start
  if (daysUntilStart >= 7) {
    return booking.totalPrice;
  }

  // 50% refund if cancelled 3-6 days before start
  if (daysUntilStart >= 3) {
    return Math.floor(booking.totalPrice * 0.5);
  }

  // No refund if cancelled less than 3 days before start
  return 0;
}

/**
 * Determines if a booking is eligible for refund
 * @param booking - The booking to check
 * @returns boolean - true if eligible for refund
 */
export function isRefundEligible(booking: Booking): boolean {
  // Must be paid
  if (!booking.isPaid) {
    return false;
  }

  // Must not already be refunded
  if (booking.paymentStatus === 'refunded') {
    return false;
  }

  // Must not be completed or cancelled
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return false;
  }

  // Must not have started yet
  const startDate = new Date(booking.startDate);
  const now = new Date();
  
  return startDate > now;
}

/**
 * Calculates platform commission (15%)
 * @param totalPrice - Total booking price
 * @returns number - Commission amount
 */
export function calculateCommission(totalPrice: number): number {
  return Math.floor(totalPrice * 0.15);
}

/**
 * Calculates GST on commission (18%)
 * @param commission - Commission amount
 * @returns number - GST amount
 */
export function calculateGST(commission: number): number {
  return Math.floor(commission * 0.18);
}

/**
 * Calculates payment breakdown
 * @param totalPrice - Total booking price
 * @returns Object with breakdown details
 */
export function calculatePaymentBreakdown(totalPrice: number) {
  const commission = calculateCommission(totalPrice);
  const gst = calculateGST(commission);
  const venueOwnerReceives = totalPrice - commission;
  const platformEarns = commission + gst;

  return {
    subtotal: totalPrice,
    commission,
    gst,
    totalPayable: totalPrice,
    venueOwnerReceives,
    platformEarns,
  };
}
