'use client';

import { Booking } from '@/types';
import { format } from 'date-fns';
import { Download, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculatePaymentBreakdown } from '@/lib/payments/refund';

interface InvoiceCardProps {
  booking: Booking;
  paymentId?: string;
  transactionId?: string;
}

export default function InvoiceCard({
  booking,
  paymentId,
  transactionId,
}: InvoiceCardProps) {
  const breakdown = calculatePaymentBreakdown(booking.totalPrice);

  const handleDownload = () => {
    // TODO: Implement PDF generation
    alert('PDF generation coming soon!');
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Invoice</h3>
            <p className="text-sm text-muted-foreground">
              #{booking._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Invoice Details */}
      <div className="mt-4 space-y-4">
        {/* Booking Info */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Booking Details
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Space</span>
              <span className="font-medium">{booking.spaceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{booking.duration} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dates</span>
              <span className="font-medium">
                {format(new Date(booking.startDate), 'MMM dd')} -{' '}
                {format(new Date(booking.endDate), 'MMM dd, yyyy')}
              </span>
            </div>
            {booking.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Date</span>
                <span className="font-medium">
                  {format(new Date(booking.paidAt), 'PPP')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="border-t pt-4">
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Amount Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{breakdown.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="ml-4">Platform Commission (15%)</span>
              <span>₹{breakdown.commission.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="ml-4">GST on Commission (18%)</span>
              <span>₹{breakdown.gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total Payable</span>
              <span className="text-lg">
                ₹{breakdown.totalPayable.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        {transactionId && (
          <div className="border-t pt-4">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Transaction Details
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">{transactionId}</span>
              </div>
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs">{paymentId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Platform Info */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <p className="mb-1">
            <strong>Note:</strong> Venue owner will receive ₹
            {breakdown.venueOwnerReceives.toLocaleString('en-IN')} after
            deducting platform commission.
          </p>
          <p>
            Platform earnings: ₹{breakdown.platformEarns.toLocaleString('en-IN')}{' '}
            (includes commission + GST)
          </p>
        </div>
      </div>
    </div>
  );
}
