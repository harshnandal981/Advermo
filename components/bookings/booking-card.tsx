'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Booking } from '@/types';
import BookingStatusBadge from './booking-status-badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Ban 
} from 'lucide-react';
import { format } from 'date-fns';
import { adSpaces } from '@/lib/data';

interface BookingCardProps {
  booking: Booking;
  userRole: 'brand' | 'venue';
  onUpdate?: () => void;
}

export default function BookingCard({ booking, userRole, onUpdate }: BookingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Get space thumbnail
  const space = adSpaces.find((s) => s.id === booking.spaceId);
  const thumbnail = space?.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400';

  const handleAction = async (action: string) => {
    if (action === 'reject' && !rejectionReason) {
      setShowRejectModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action,
          ...(action === 'reject' && { rejectionReason })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      if (onUpdate) {
        onUpdate();
      }
      
      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    } finally {
      setLoading(false);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  return (
    <>
      <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Thumbnail */}
          <div className="relative h-48 md:h-full md:col-span-1">
            <Image
              src={thumbnail}
              alt={booking.spaceName}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4 md:col-span-3 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{booking.spaceName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                  </span>
                  <span className="text-muted-foreground">({booking.duration} days)</span>
                </div>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Campaign</p>
                <p className="font-medium">{booking.campaignObjective}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Price</p>
                <p className="font-medium text-primary">₹{booking.totalPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  {userRole === 'brand' ? 'Venue Owner' : 'Brand'}
                </p>
                <p className="font-medium">
                  {userRole === 'brand' ? 'Venue Owner' : booking.brandName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Payment</p>
                <p className="font-medium capitalize">{booking.paymentStatus}</p>
              </div>
            </div>

            {/* Rejection Reason (if rejected) */}
            {booking.status === 'rejected' && booking.rejectionReason && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">
                  <span className="font-semibold">Rejection Reason:</span> {booking.rejectionReason}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/bookings/${booking._id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

              {/* Venue Owner Actions */}
              {userRole === 'venue' && booking.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleAction('confirm')}
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction('reject')}
                    disabled={loading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}

              {/* Brand Actions */}
              {userRole === 'brand' && ['pending', 'confirmed'].includes(booking.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction('cancel')}
                  disabled={loading}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Reject Booking</h3>
            <p className="text-muted-foreground mb-4">
              Please provide a reason for rejecting this booking request:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
              maxLength={500}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={!rejectionReason || loading}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
