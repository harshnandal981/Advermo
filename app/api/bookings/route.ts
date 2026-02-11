import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Activity from '@/lib/models/Activity';
import { adSpaces } from '@/lib/data';
import { sendEmail } from '@/lib/email/service';
import { shouldSendEmail } from '@/lib/email/helpers';
import BookingCreatedEmail from '@/emails/booking-created';
import BookingReceivedEmail from '@/emails/booking-received';
import { anonymizeName } from '@/lib/social-proof/helpers';

// Helper function to check date conflicts
async function checkDateConflict(
  spaceId: string,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const query: any = {
    spaceId,
    status: { $in: ['confirmed', 'active'] },
    $or: [
      // New booking starts during existing booking
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      // New booking ends during existing booking
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      // New booking completely contains existing booking
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query);
  return !!conflictingBooking;
}

// Helper function to calculate price
function calculatePrice(
  dailyFootfall: number,
  duration: number,
  cpm: number
): number {
  const totalImpressions = dailyFootfall * duration;
  const price = (totalImpressions / 1000) * cpm;
  return Math.round(price * 100) / 100; // Round to 2 decimal places
}

// POST /api/bookings - Create a new booking request
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a booking' },
        { status: 401 }
      );
    }

    // Only brands can create bookings
    if (session.user.role !== 'brand') {
      return NextResponse.json(
        { error: 'Only brands can create booking requests' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      spaceId,
      startDate,
      endDate,
      campaignObjective,
      targetAudience,
      budget,
      notes,
    } = body;

    // Validate required fields
    if (!spaceId || !startDate || !endDate || !campaignObjective || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the space
    const space = adSpaces.find((s) => s.id === spaceId);
    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      );
    }

    // Parse and validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Validate start date is at least 3 days in the future
    if (start < threeDaysFromNow) {
      return NextResponse.json(
        { error: 'Start date must be at least 3 days in the future' },
        { status: 400 }
      );
    }

    // Validate end date is after start date
    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Calculate duration
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Validate duration
    if (duration < 7) {
      return NextResponse.json(
        { error: 'Minimum campaign duration is 7 days' },
        { status: 400 }
      );
    }

    if (duration > 365) {
      return NextResponse.json(
        { error: 'Maximum campaign duration is 365 days' },
        { status: 400 }
      );
    }

    // Validate target audience
    if (targetAudience.length < 10) {
      return NextResponse.json(
        { error: 'Target audience must be at least 10 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for date conflicts
    const hasConflict = await checkDateConflict(spaceId, start, end);
    if (hasConflict) {
      return NextResponse.json(
        { error: 'This space is already booked for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate total price
    const cpm = space.price / space.monthlyImpressions * 1000;
    const totalPrice = calculatePrice(space.dailyFootfall, duration, cpm);

    // Create booking
    const booking = await Booking.create({
      spaceId,
      spaceName: space.name,
      brandId: session.user.id,
      brandName: session.user.name,
      brandEmail: session.user.email,
      venueOwnerId: 'venue-owner-1', // TODO: Get from space data when implemented
      venueOwnerEmail: 'owner@example.com', // TODO: Get from space data when implemented
      startDate: start,
      endDate: end,
      duration,
      campaignObjective,
      targetAudience,
      budget: budget || undefined,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      notes: notes || undefined,
    });

    // Send email notifications
    try {
      // Email to brand (booking creator)
      const shouldEmailBrand = await shouldSendEmail(session.user.id, 'booking_created');
      if (shouldEmailBrand) {
        await sendEmail({
          to: session.user.email!,
          subject: 'Booking Request Submitted - Awaiting Confirmation',
          react: BookingCreatedEmail({ 
            booking: booking as any, 
            space: { name: space.name, location: space.location } 
          }),
          template: 'booking_created',
          metadata: { 
            bookingId: booking._id.toString(), 
            type: 'booking_created',
            brandId: session.user.id,
          },
        });
      }

      // Email to venue owner
      // Note: Using placeholder email until space-owner relationship is implemented
      if (booking.venueOwnerEmail && booking.venueOwnerEmail !== 'owner@example.com') {
        await sendEmail({
          to: booking.venueOwnerEmail,
          subject: `New Booking Request for ${space.name}`,
          react: BookingReceivedEmail({ 
            booking: booking as any, 
            brand: {
              name: session.user.name!,
              email: session.user.email!,
            },
            space: { name: space.name, location: space.location } 
          }),
          template: 'booking_received',
          metadata: { 
            bookingId: booking._id.toString(), 
            type: 'booking_received',
            venueOwnerId: booking.venueOwnerId,
          },
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the booking creation
      console.error('Error sending booking emails:', emailError);
    }

    // Log activity for social proof
    try {
      // Extract city from location (handle various formats)
      let city = '';
      if (space.location) {
        const locationParts = space.location.split(',');
        city = locationParts[0]?.trim() || '';
      }
      
      await Activity.create({
        type: 'booking_created',
        userId: session.user.id,
        userName: anonymizeName(session.user.name || 'User'),
        resourceId: booking._id,
        resourceName: space.name,
        timestamp: new Date(),
        isPublic: true,
        city,
      });
    } catch (activityError) {
      // Log error but don't fail the booking
      console.error('Error logging activity:', activityError);
    }

    return NextResponse.json(
      { booking, message: 'Booking request created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get user's bookings
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view bookings' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();

    // Build query based on user role
    const query: any = {};
    if (session.user.role === 'brand') {
      query.brandId = session.user.id;
    } else if (session.user.role === 'venue') {
      query.venueOwnerId = session.user.id;
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    // Fetch bookings
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
