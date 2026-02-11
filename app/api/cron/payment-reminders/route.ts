import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { sendEmail } from '@/lib/email/service';
import { shouldSendEmail } from '@/lib/email/helpers';
import PaymentFailedEmail from '@/emails/payment-failed';

// POST /api/cron/payment-reminders - Send payment reminders (runs twice daily)
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (for Vercel Cron Jobs)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let emailsSent = 0;
    let bookingsCancelled = 0;
    const errors: string[] = [];

    // 1. Find confirmed but unpaid bookings > 12 hours old (send reminder)
    const unpaidBookings = await Booking.find({
      status: 'confirmed',
      paymentStatus: 'pending',
      updatedAt: {
        $gte: twentyFourHoursAgo,
        $lte: twelveHoursAgo,
      },
    }).lean();

    for (const booking of unpaidBookings) {
      try {
        const shouldEmail = await shouldSendEmail(booking.brandId, 'payment_failed');
        if (shouldEmail) {
          await sendEmail({
            to: booking.brandEmail,
            subject: 'Payment Reminder - Complete Your Booking',
            react: PaymentFailedEmail({
              booking: {
                _id: booking._id.toString(),
                spaceName: booking.spaceName,
                totalPrice: booking.totalPrice,
              },
              error: 'Payment pending. Please complete payment within 24 hours to secure your booking.',
            }),
            template: 'payment_failed',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'payment_reminder',
            },
          });
          emailsSent++;
        }
      } catch (error: any) {
        errors.push(`Error sending payment reminder for booking ${booking._id}: ${error.message}`);
      }
    }

    // 2. Find confirmed but unpaid bookings > 24 hours old (auto-cancel)
    const expiredBookings = await Booking.find({
      status: 'confirmed',
      paymentStatus: 'pending',
      updatedAt: {
        $lt: twentyFourHoursAgo,
      },
    });

    for (const booking of expiredBookings) {
      try {
        // Auto-cancel booking
        booking.status = 'cancelled';
        booking.notes = (booking.notes || '') + '\n[Auto-cancelled: Payment not received within 24 hours]';
        await booking.save();
        bookingsCancelled++;

        // Send cancellation email
        const shouldEmail = await shouldSendEmail(booking.brandId, 'booking_cancelled');
        if (shouldEmail) {
          // Import dynamically to avoid circular dependencies
          const { default: BookingCancelledEmail } = await import('@/emails/booking-cancelled');
          
          await sendEmail({
            to: booking.brandEmail,
            subject: `Booking Cancelled - Payment Timeout`,
            react: BookingCancelledEmail({
              booking: {
                _id: booking._id.toString(),
                spaceName: booking.spaceName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                totalPrice: booking.totalPrice,
              },
              cancelledBy: 'system',
              reason: 'Payment was not completed within 24 hours of booking confirmation.',
              refundInfo: {
                willRefund: false,
              },
            }),
            template: 'booking_cancelled',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'auto_cancelled',
            },
          });
          emailsSent++;
        }
      } catch (error: any) {
        errors.push(`Error auto-cancelling booking ${booking._id}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      reminders: unpaidBookings.length,
      bookingsCancelled,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error in payment reminders cron:', error);
    return NextResponse.json(
      { error: 'Failed to process payment reminders', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return POST(req);
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
