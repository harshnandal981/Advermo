'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Booking } from '@/types';
import { calculateRefundAmount } from '@/lib/payments/refund';

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  onSuccess?: () => void;
}

export default function RefundDialog({
  open,
  onOpenChange,
  booking,
  onSuccess,
}: RefundDialogProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refundAmount = calculateRefundAmount(booking);
  const refundPercentage =
    booking.totalPrice > 0
      ? Math.round((refundAmount / booking.totalPrice) * 100)
      : 0;

  const handleRefund = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking._id,
          reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process refund');
      }

      // Success
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      } else {
        // Reload page to show updated status
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking and request a refund?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Refund Amount Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Refund Policy</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Original Amount
                </span>
                <span className="font-semibold">
                  ₹{booking.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Refund Amount ({refundPercentage}%)
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{refundAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {refundPercentage === 100 &&
                '✓ Full refund (cancelled 7+ days before start)'}
              {refundPercentage === 50 &&
                '✓ 50% refund (cancelled 3-6 days before start)'}
              {refundPercentage === 0 &&
                '✗ No refund (cancelled less than 3 days before start)'}
            </p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're cancelling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            disabled={loading || refundAmount === 0}
            variant="destructive"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Confirm Refund</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
