import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/lib/models/User';
import { EmailPreferences, EmailTemplate } from '@/types';

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Get user email preferences
 */
export async function getUserEmailPreferences(userId: string): Promise<EmailPreferences> {
  try {
    await connectDB();
    const user = (await User.findById(userId).lean()) as unknown as IUser | null;
    
    if (!user || !user.emailPreferences) {
      // Return default preferences
      return {
        bookingUpdates: true,
        paymentReceipts: true,
        campaignReminders: true,
        marketing: false,
      };
    }

    return user.emailPreferences;
  } catch (error) {
    console.error('Error getting user email preferences:', error);
    // Return default preferences on error
    return {
      bookingUpdates: true,
      paymentReceipts: true,
      campaignReminders: true,
      marketing: false,
    };
  }
}

/**
 * Check if email should be sent based on user preferences
 */
export async function shouldSendEmail(
  userId: string,
  template: EmailTemplate
): Promise<boolean> {
  try {
    const preferences = await getUserEmailPreferences(userId);

    // Map templates to preference keys
    const templatePreferenceMap: Record<string, keyof EmailPreferences> = {
      welcome: 'bookingUpdates',
      booking_created: 'bookingUpdates',
      booking_received: 'bookingUpdates',
      booking_confirmed: 'bookingUpdates',
      booking_rejected: 'bookingUpdates',
      booking_cancelled: 'bookingUpdates',
      payment_success: 'paymentReceipts',
      payment_failed: 'paymentReceipts',
      refund_processed: 'paymentReceipts',
      campaign_starting_soon: 'campaignReminders',
      campaign_started: 'campaignReminders',
      campaign_completed: 'campaignReminders',
      password_reset: 'bookingUpdates', // Always send security emails
      email_verification: 'bookingUpdates', // Always send verification emails
    };

    const preferenceKey = templatePreferenceMap[template];
    
    // If no preference mapping, default to true (send the email)
    if (!preferenceKey) {
      return true;
    }

    // For security-related emails, always send
    if (template === 'password_reset' || template === 'email_verification') {
      return true;
    }

    return preferences[preferenceKey] !== false;
  } catch (error) {
    console.error('Error checking email preferences:', error);
    // On error, default to sending the email (better to send than miss important emails)
    return true;
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate days until a date
 */
export function daysUntil(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Generate unsubscribe token (simple implementation)
 */
export function generateUnsubscribeToken(userId: string, email: string): string {
  // In production, use a proper JWT or signed token
  const data = `${userId}:${email}:${Date.now()}`;
  return Buffer.from(data).toString('base64url');
}

/**
 * Verify unsubscribe token
 */
export function verifyUnsubscribeToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const [userId, email] = decoded.split(':');
    
    if (!userId || !email) {
      return null;
    }

    return { userId, email };
  } catch (error) {
    return null;
  }
}
