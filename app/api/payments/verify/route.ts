import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Payment from '@/lib/models/Payment';
import { verifyPaymentSignature } from '@/lib/payments/verify';

// POST /api/payments/verify - Verify payment signature
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to verify payment' },
        { status: 401 }
      );
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingId,
    } = await req.json();

    // Validate input
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user has permission
    if (booking.brandId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to verify this payment' },
        { status: 403 }
      );
    }

    // Update payment record
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'success';
    payment.completedAt = new Date();
    await payment.save();

    // Update booking
    booking.isPaid = true;
    booking.paymentStatus = 'paid';
    booking.paymentId = payment._id;
    booking.paidAt = new Date();
    
    // Auto-confirm booking after payment
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
    }
    
    await booking.save();

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        completedAt: payment.completedAt,
      },
      booking: {
        id: booking._id,
        status: booking.status,
        isPaid: booking.isPaid,
      },
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
