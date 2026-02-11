import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Payment from '@/lib/models/Payment';
import Razorpay from 'razorpay';
import { calculateRefundAmount, isRefundEligible } from '@/lib/payments/refund';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// POST /api/payments/refund - Initiate refund
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to request a refund' },
        { status: 401 }
      );
    }

    const { bookingId, reason } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user has permission (brand only)
    if (booking.brandId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to refund this booking' },
        { status: 403 }
      );
    }

    // Check if refund is eligible
    if (!isRefundEligible(booking)) {
      return NextResponse.json(
        { error: 'This booking is not eligible for refund' },
        { status: 400 }
      );
    }

    // Calculate refund amount
    const refundAmount = calculateRefundAmount(booking);

    if (refundAmount === 0) {
      return NextResponse.json(
        {
          error:
            'No refund available. Cancellations must be made at least 3 days before the start date.',
        },
        { status: 400 }
      );
    }

    // Find payment record
    const payment = await Payment.findById(booking.paymentId);

    if (!payment || !payment.razorpayPaymentId) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Convert refund amount to paise
    const refundAmountInPaise = Math.round(refundAmount * 100);

    // Create refund via Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: refundAmountInPaise,
      notes: {
        reason: reason || 'Booking cancelled by user',
        bookingId: bookingId.toString(),
      },
    });

    // Update payment status
    payment.status = 'refunded';
    payment.notes = {
      ...payment.notes,
      refundId: refund.id,
      refundAmount: refundAmountInPaise,
      refundReason: reason,
      refundInitiatedAt: new Date(),
    };
    await payment.save();

    // Update booking
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    booking.notes = booking.notes
      ? `${booking.notes}\n\nRefund initiated: ${reason || 'User cancellation'}`
      : `Refund initiated: ${reason || 'User cancellation'}`;
    await booking.save();

    return NextResponse.json({
      success: true,
      message: 'Refund initiated successfully',
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status,
      },
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    );
  }
}
