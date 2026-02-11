'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loadRazorpay } from '@/lib/razorpay';
import { RazorpayOptions, RazorpayResponse } from '@/types';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void;
}

export default function PaymentButton({
  bookingId,
  amount,
  onSuccess,
  onFailure,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Advermo',
        description: `Payment for ${orderData.booking.spaceName}`,
        order_id: orderData.orderId,
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: '',
        },
        theme: {
          color: '#6366f1', // Indigo-500
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            
            // Success callback
            if (onSuccess) {
              onSuccess(verifyData.payment.id);
            } else {
              // Redirect to success page
              window.location.href = `/payments/success?bookingId=${bookingId}`;
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Payment verification error:', errorMessage);
            if (onFailure) {
              onFailure(errorMessage);
            } else {
              window.location.href = `/payments/failure?reason=${encodeURIComponent(errorMessage)}`;
            }
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay!(options);
      razorpay.open();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      console.error('Payment error:', errorMessage);
      setLoading(false);
      if (onFailure) {
        onFailure(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>Proceed to Payment (₹{amount.toLocaleString('en-IN')})</>
      )}
    </Button>
  );
}
