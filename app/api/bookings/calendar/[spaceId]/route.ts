import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

// GET /api/bookings/calendar/:spaceId - Get all confirmed/active bookings for a space
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> }
) {
  try {
    const { spaceId } = await params;

    await connectDB();

    // Get all confirmed or active bookings for this space
    const bookings = await Booking.find({
      spaceId,
      status: { $in: ['confirmed', 'active'] },
    })
      .select('startDate endDate status')
      .lean();

    // Return array of date ranges
    const bookedDates = bookings.map((booking) => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
    }));

    return NextResponse.json({ bookedDates });
  } catch (error: any) {
    console.error('Error fetching calendar bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar bookings' },
      { status: 500 }
    );
  }
}
