'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason') || 'Payment was unsuccessful';
  const bookingId = searchParams.get('bookingId');

  const handleRetry = () => {
    if (bookingId) {
      router.push(`/bookings/${bookingId}/payment`);
    } else {
      router.push('/bookings');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Failure Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-full bg-red-100 p-6 dark:bg-red-950">
              <XCircle className="h-20 w-20 text-red-600 dark:text-red-400" />
            </div>
          </motion.div>

          {/* Failure Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-red-600 dark:text-red-400">
              Payment Failed
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              We couldn't process your payment. Don't worry, no amount has been
              charged.
            </p>
          </motion.div>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950"
          >
            <h2 className="mb-2 font-semibold text-red-600 dark:text-red-400">
              Error Details
            </h2>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              {reason}
            </p>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 rounded-lg border bg-card p-6"
          >
            <h3 className="mb-3 font-semibold">Common Solutions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Check if you have sufficient balance in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Verify your card details and CVV are correct</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Ensure your payment method supports online transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Try using a different payment method (UPI, Net Banking)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Contact your bank if the issue persists
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
            <Button
              onClick={handleRetry}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Payment
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/bookings">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Bookings
              </Link>
            </Button>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>
              Need help?{' '}
              <Link
                href="mailto:support@advermo.com"
                className="text-primary hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
