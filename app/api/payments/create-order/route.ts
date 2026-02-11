import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Payment from '@/lib/models/Payment';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// POST /api/payments/create-order - Create Razorpay order
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a payment order' },
        { status: 401 }
      );
    }

    // Only brands can make payments
    if (session.user.role !== 'brand') {
      return NextResponse.json(
        { error: 'Only brands can make payments' },
        { status: 403 }
      );
    }

    const { bookingId } = await req.json();

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

    // Verify booking belongs to user
    if (booking.brandId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to pay for this booking' },
        { status: 403 }
      );
    }

    // Check if already paid
    if (booking.isPaid) {
      return NextResponse.json(
        { error: 'This booking has already been paid' },
        { status: 400 }
      );
    }

    // Check if booking is in valid state
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      return NextResponse.json(
        { error: 'Cannot pay for a cancelled or rejected booking' },
        { status: 400 }
      );
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(booking.totalPrice * 100);

    // Generate unique receipt ID
    const receipt = `receipt_${bookingId}_${Date.now()}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        bookingId: bookingId.toString(),
        brandId: session.user.id,
        spaceName: booking.spaceName,
      },
    });

    // Create Payment record
    const payment = await Payment.create({
      bookingId: booking._id,
      brandId: session.user.id,
      amount: amountInPaise,
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      receipt,
      notes: {
        spaceName: booking.spaceName,
        duration: booking.duration,
        startDate: booking.startDate,
        endDate: booking.endDate,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      booking: {
        id: booking._id,
        spaceName: booking.spaceName,
        totalPrice: booking.totalPrice,
      },
      paymentId: payment._id,
    });
  } catch (error: any) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
