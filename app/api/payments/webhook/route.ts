import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Booking from '@/lib/models/Booking';
import { verifyWebhookSignature } from '@/lib/payments/verify';

// POST /api/payments/webhook - Handle Razorpay webhooks
export async function POST(req: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = req.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse the event
    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    await connectDB();

    switch (eventType) {
      case 'payment.captured': {
        // Payment was successfully captured
        const paymentEntity = payload.payment.entity;
        
        const payment = await Payment.findOne({
          razorpayOrderId: paymentEntity.order_id,
        });

        if (payment && payment.status !== 'success') {
          payment.razorpayPaymentId = paymentEntity.id;
          payment.status = 'success';
          payment.method = paymentEntity.method;
          payment.completedAt = new Date();
          await payment.save();

          // Update booking
          const booking = await Booking.findById(payment.bookingId);
          if (booking && !booking.isPaid) {
            booking.isPaid = true;
            booking.paymentStatus = 'paid';
            booking.paymentId = payment._id;
            booking.paidAt = new Date();
            
            // Auto-confirm after payment
            if (booking.status === 'pending') {
              booking.status = 'confirmed';
            }
            
            await booking.save();
          }

          console.log('Payment captured:', paymentEntity.id);
        }
        break;
      }

      case 'payment.failed': {
        // Payment failed
        const paymentEntity = payload.payment.entity;
        
        const payment = await Payment.findOne({
          razorpayOrderId: paymentEntity.order_id,
        });

        if (payment) {
          payment.status = 'failed';
          payment.notes = {
            ...payment.notes,
            failureReason: paymentEntity.error_description,
          };
          await payment.save();
        }

        console.log('Payment failed:', paymentEntity.id);
        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        // Refund was processed
        const refundEntity = payload.refund.entity;
        
        const payment = await Payment.findOne({
          razorpayPaymentId: refundEntity.payment_id,
        });

        if (payment) {
          payment.status = 'refunded';
          payment.notes = {
            ...payment.notes,
            refundId: refundEntity.id,
            refundAmount: refundEntity.amount,
          };
          await payment.save();

          // Update booking
          const booking = await Booking.findById(payment.bookingId);
          if (booking) {
            booking.paymentStatus = 'refunded';
            await booking.save();
          }
        }

        console.log('Refund processed:', refundEntity.id);
        break;
      }

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Razorpay from retrying
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
