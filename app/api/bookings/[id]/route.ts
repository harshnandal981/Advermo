import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { sendEmail } from '@/lib/email/service';
import { shouldSendEmail } from '@/lib/email/helpers';
import { adSpaces } from '@/lib/data';
import BookingConfirmedEmail from '@/emails/booking-confirmed';
import BookingRejectedEmail from '@/emails/booking-rejected';
import BookingCancelledEmail from '@/emails/booking-cancelled';

// GET /api/bookings/:id - Get single booking details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view booking details' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const booking = await Booking.findById(id).lean() as any;

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify user has access (is brand or venue owner of this booking)
    const hasAccess =
      booking.brandId === session.user.id ||
      booking.venueOwnerId === session.user.id;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have permission to view this booking' },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/:id - Update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to update a booking' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { action, rejectionReason } = body;

    await connectDB();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify permissions based on action
    if (action === 'confirm' || action === 'reject') {
      // Only venue owners can confirm or reject
      if (session.user.role !== 'venue' || booking.venueOwnerId !== session.user.id) {
        return NextResponse.json(
          { error: 'Only the venue owner can confirm or reject bookings' },
          { status: 403 }
        );
      }

      if (booking.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending bookings can be confirmed or rejected' },
          { status: 400 }
        );
      }

      if (action === 'confirm') {
        booking.status = 'confirmed';
      } else if (action === 'reject') {
        if (!rejectionReason) {
          return NextResponse.json(
            { error: 'Rejection reason is required' },
            { status: 400 }
          );
        }
        booking.status = 'rejected';
        booking.rejectionReason = rejectionReason;
      }
      
      await booking.save();
      
      // Send email notifications
      try {
        const space = adSpaces.find((s) => s.id === booking.spaceId);
        const spaceName = space?.name || booking.spaceName;
        const spaceLocation = space?.location || '';
        
        if (action === 'confirm') {
          // Email to brand
          const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'booking_confirmed');
          if (shouldEmailBrand) {
            await sendEmail({
              to: booking.brandEmail,
              subject: `Booking Confirmed! 🎉 ${spaceName}`,
              react: BookingConfirmedEmail({ 
                booking: booking.toObject() as any, 
                space: { name: spaceName, location: spaceLocation } 
              }),
              template: 'booking_confirmed',
              metadata: { 
                bookingId: booking._id.toString(), 
                type: 'booking_confirmed',
                brandId: booking.brandId,
              },
            });
          }
        } else if (action === 'reject') {
          // Email to brand
          const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'booking_rejected');
          if (shouldEmailBrand) {
            await sendEmail({
              to: booking.brandEmail,
              subject: `Booking Request Update - ${spaceName}`,
              react: BookingRejectedEmail({ 
                booking: booking.toObject() as any, 
                space: { name: spaceName, location: spaceLocation },
                reason: rejectionReason 
              }),
              template: 'booking_rejected',
              metadata: { 
                bookingId: booking._id.toString(), 
                type: 'booking_rejected',
                brandId: booking.brandId,
              },
            });
          }
        }
      } catch (emailError) {
        console.error('Error sending status update emails:', emailError);
      }
    } else if (action === 'cancel') {
      // Only brands can cancel their own bookings
      if (booking.brandId !== session.user.id) {
        return NextResponse.json(
          { error: 'Only the brand can cancel this booking' },
          { status: 403 }
        );
      }

      // Can only cancel pending or confirmed bookings
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return NextResponse.json(
          { error: 'Only pending or confirmed bookings can be cancelled' },
          { status: 400 }
        );
      }

      booking.status = 'cancelled';
      
      await booking.save();
      
      // Send cancellation email to both parties
      try {
        const space = adSpaces.find((s) => s.id === booking.spaceId);
        const spaceName = space?.name || booking.spaceName;
        const spaceLocation = space?.location || '';
        
        // Email to brand
        const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'booking_cancelled');
        if (shouldEmailBrand) {
          await sendEmail({
            to: booking.brandEmail,
            subject: `Booking Cancelled - ${spaceName}`,
            react: BookingCancelledEmail({ 
              booking: booking.toObject() as any,
              cancelledBy: 'brand',
            }),
            template: 'booking_cancelled',
            metadata: { 
              bookingId: booking._id.toString(), 
              type: 'booking_cancelled',
            },
          });
        }
        
        // Email to venue owner
        if (booking.venueOwnerEmail && booking.venueOwnerEmail !== 'owner@example.com') {
          await sendEmail({
            to: booking.venueOwnerEmail,
            subject: `Booking Cancelled - ${spaceName}`,
            react: BookingCancelledEmail({ 
              booking: booking.toObject() as any,
              cancelledBy: 'brand',
            }),
            template: 'booking_cancelled',
            metadata: { 
              bookingId: booking._id.toString(), 
              type: 'booking_cancelled',
            },
          });
        }
      } catch (emailError) {
        console.error('Error sending cancellation emails:', emailError);
      }
    } else if (action === 'activate') {
      // System action to mark as active when start date arrives
      if (booking.status !== 'confirmed') {
        return NextResponse.json(
          { error: 'Only confirmed bookings can be activated' },
          { status: 400 }
        );
      }
      booking.status = 'active';
    } else if (action === 'complete') {
      // System action to mark as completed when end date passes
      if (booking.status !== 'active') {
        return NextResponse.json(
          { error: 'Only active bookings can be completed' },
          { status: 400 }
        );
      }
      booking.status = 'completed';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await booking.save();

    return NextResponse.json({
      booking,
      message: `Booking ${action}ed successfully`,
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
