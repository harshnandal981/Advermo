import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Payment from '@/lib/models/Payment';

// GET /api/payments/:bookingId - Get payment details for a booking
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view payment details' },
        { status: 401 }
      );
    }

    const { bookingId } = await params;

    await connectDB();

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user has access (brand or venue owner)
    if (
      booking.brandId !== session.user.id &&
      booking.venueOwnerId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this payment' },
        { status: 403 }
      );
    }

    // Find payment record
    const payment = await Payment.findOne({ bookingId });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Return payment details (hide sensitive info)
    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        receipt: payment.receipt,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        notes: payment.notes,
      },
      booking: {
        id: booking._id,
        spaceName: booking.spaceName,
        totalPrice: booking.totalPrice,
        status: booking.status,
        isPaid: booking.isPaid,
        paidAt: booking.paidAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}
