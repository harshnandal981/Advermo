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
  Target, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Ban,
  ArrowLeft,
  FileText,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { adSpaces } from '@/lib/data';

interface BookingDetailsProps {
  booking: Booking;
  userRole: 'brand' | 'venue';
}

export default function BookingDetails({ booking, userRole }: BookingDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Get space details
  const space = adSpaces.find((s) => s.id === booking.spaceId);
  const thumbnail = space?.images[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';

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
  const createdDate = new Date(booking.createdAt);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Booking Details</h1>
              <p className="text-muted-foreground">ID: {booking._id}</p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Space Thumbnail */}
          <div className="relative h-64 rounded-lg overflow-hidden mb-6">
            <Image
              src={thumbnail}
              alt={booking.spaceName}
              fill
              className="object-cover"
            />
          </div>

          {/* Space Name */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">{booking.spaceName}</h2>
            {space && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{space.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Campaign Objective</p>
              <p className="font-medium">{booking.campaignObjective}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
              <p className="font-medium">{booking.targetAudience}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium">{format(startDate, 'MMMM d, yyyy')}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">End Date</p>
              <p className="font-medium">{format(endDate, 'MMMM d, yyyy')}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{booking.duration} days</p>
            </div>

            {booking.budget && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="font-medium">₹{booking.budget.toLocaleString()}</p>
              </div>
            )}
          </div>

          {booking.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes
              </p>
              <p className="text-sm">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Price</p>
              <p className="text-2xl font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
              <p className="font-medium capitalize">{booking.paymentStatus}</p>
            </div>
          </div>
        </div>

        {/* Parties Information */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Booking Parties
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Brand</p>
              <p className="font-medium">{booking.brandName}</p>
              <p className="text-sm text-muted-foreground">{booking.brandEmail}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Venue Owner</p>
              <p className="font-medium">Venue Owner</p>
              <p className="text-sm text-muted-foreground">{booking.venueOwnerEmail}</p>
            </div>
          </div>
        </div>

        {/* Rejection Reason */}
        {booking.status === 'rejected' && booking.rejectionReason && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-400">
              Rejection Reason
            </h3>
            <p className="text-red-700 dark:text-red-300">{booking.rejectionReason}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Booking Created</p>
                <p className="text-sm text-muted-foreground">{format(createdDate, 'MMMM d, yyyy h:mm a')}</p>
              </div>
            </div>
            
            {booking.status !== 'pending' && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {booking.status === 'confirmed' || booking.status === 'active' || booking.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium capitalize">{booking.status}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(booking.updatedAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Venue Owner Actions */}
          {userRole === 'venue' && booking.status === 'pending' && (
            <>
              <Button
                onClick={() => handleAction('confirm')}
                disabled={loading}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Booking
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={loading}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Booking
              </Button>
            </>
          )}

          {/* Brand Actions */}
          {userRole === 'brand' && ['pending', 'confirmed'].includes(booking.status) && (
            <Button
              variant="destructive"
              onClick={() => handleAction('cancel')}
              disabled={loading}
              className="flex-1"
            >
              <Ban className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          )}
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
    </div>
  );
}
