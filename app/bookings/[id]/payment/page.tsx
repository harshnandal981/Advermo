import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import PaymentButton from '@/components/payments/payment-button';
import { calculatePaymentBreakdown } from '@/lib/payments/refund';

export default async function BookingPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/');
  }

  const { id } = await params;

  // Connect to database
  await connectDB();

  // Fetch booking
  const bookingDoc = await Booking.findById(id).lean();

  if (!bookingDoc) {
    notFound();
  }

  const booking: any = bookingDoc;

  // Verify user is the brand who made the booking
  if (booking.brandId !== session.user.id) {
    redirect('/bookings');
  }

  // Redirect if already paid
  if (booking.isPaid) {
    redirect(`/bookings/${id}`);
  }

  // Redirect if booking is cancelled or rejected
  if (booking.status === 'cancelled' || booking.status === 'rejected') {
    redirect(`/bookings/${id}`);
  }

  const breakdown = calculatePaymentBreakdown(booking.totalPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/bookings/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Booking
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Complete Your Payment</h1>
          <p className="text-muted-foreground">
            Secure your booking by completing the payment
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Booking Summary</h2>

              {/* Space Info */}
              <div className="mb-6 flex items-start gap-4 rounded-lg border p-4">
                <div className="rounded bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{booking.spaceName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Campaign Duration: {booking.duration} days
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.startDate), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.endDate), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold">Campaign Details</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objective</span>
                    <span className="font-medium">
                      {booking.campaignObjective}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Target Audience
                    </span>
                    <span className="font-medium">
                      {booking.targetAudience}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Payment Details</h2>

              {/* Amount Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{breakdown.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-4">Platform Fee (15%)</span>
                  <span>₹{breakdown.commission.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="ml-4">GST (18%)</span>
                  <span>₹{breakdown.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">
                      ₹{breakdown.totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <PaymentButton
                bookingId={id}
                amount={booking.totalPrice}
              />

              {/* Payment Info */}
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  <p>
                    Payment must be completed within 24 hours or booking will be
                    auto-cancelled
                  </p>
                </div>
                <p className="rounded-lg bg-muted/50 p-2">
                  ✓ Secure payment via Razorpay
                  <br />✓ Supports UPI, Cards, Net Banking
                  <br />✓ 100% secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
