'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details
      fetch(`/api/bookings/${bookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setBooking(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching booking:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-950">
              <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-green-600 dark:text-green-400">
              Payment Successful!
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Your payment has been processed successfully. Your booking is now
              confirmed!
            </p>
          </motion.div>

          {/* Booking Details Card */}
          {booking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 rounded-lg border bg-card p-6"
            >
              <h2 className="mb-4 text-xl font-semibold">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Space</span>
                  <span className="font-medium">{booking.spaceName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{booking.duration} days</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    ₹{booking.totalPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    ✓ Confirmed
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 rounded-lg border bg-muted/50 p-6"
          >
            <h3 className="mb-3 font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>
                  You'll receive a confirmation email with all booking details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>
                  The venue owner will be notified about your confirmed booking
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>
                  You can view your invoice and booking details anytime
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            {bookingId && (
              <Button asChild className="flex-1" size="lg">
                <Link href={`/bookings/${bookingId}`}>
                  View Booking Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/bookings">View All Bookings</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
