import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/service';
import WelcomeEmail from '@/emails/welcome';
import BookingCreatedEmail from '@/emails/booking-created';
import PaymentSuccessEmail from '@/emails/payment-success';

// POST /api/email/test - Send test email (dev mode only)
export async function POST(req: NextRequest) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test emails are only available in development mode' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { to, template = 'welcome' } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    // Test data
    const testUser = {
      name: 'Test User',
      email: to,
      role: 'brand' as const,
    };

    const testBooking = {
      _id: 'test123456789',
      spaceName: 'CCD Coffee - Koramangala',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      duration: 7,
      campaignObjective: 'Brand Awareness',
      targetAudience: 'Young professionals and students aged 20-35',
      totalPrice: 15000,
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      brandName: 'Test Brand',
      brandEmail: to,
    };

    const testSpace = {
      name: 'CCD Coffee - Koramangala',
      location: 'Koramangala, Bangalore',
    };

    const testPayment = {
      _id: 'pay123456789',
      amount: 15000,
      transactionId: 'TXN987654321',
      createdAt: new Date(),
    };

    let emailComponent;
    let subject = '';

    // Select template
    switch (template) {
      case 'welcome':
        emailComponent = WelcomeEmail({ user: testUser });
        subject = 'Welcome to Advermo! 🎉';
        break;
      
      case 'booking_created':
        emailComponent = BookingCreatedEmail({ 
          booking: testBooking, 
          space: testSpace 
        });
        subject = 'Booking Request Submitted - Awaiting Confirmation';
        break;
      
      case 'payment_success':
        emailComponent = PaymentSuccessEmail({ 
          payment: testPayment, 
          booking: testBooking 
        });
        subject = 'Payment Successful - Receipt #' + testPayment._id.slice(-8);
        break;
      
      default:
        emailComponent = WelcomeEmail({ user: testUser });
        subject = 'Test Email from Advermo';
    }

    // Send test email
    const result = await sendEmail({
      to,
      subject: `[TEST] ${subject}`,
      react: emailComponent,
      template: template as any,
      metadata: {
        test: true,
        template,
      },
    });

    if (result.success) {
      return NextResponse.json({
        message: 'Test email sent successfully',
        id: result.id,
        to,
        template,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/email/test - List available test templates
export async function GET(req: NextRequest) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Test emails are only available in development mode' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      templates: [
        'welcome',
        'booking_created',
        'booking_received',
        'booking_confirmed',
        'booking_rejected',
        'payment_success',
        'payment_failed',
        'refund_processed',
        'campaign_starting_soon',
        'campaign_started',
        'campaign_completed',
        'booking_cancelled',
        'password_reset',
        'email_verification',
      ],
      usage: {
        method: 'POST',
        endpoint: '/api/email/test',
        body: {
          to: 'recipient@example.com',
          template: 'welcome',
        },
      },
    });
  } catch (error: any) {
    console.error('Error listing test templates:', error);
    return NextResponse.json(
      { error: 'Failed to list test templates' },
      { status: 500 }
    );
  }
}
