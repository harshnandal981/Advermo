import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

// GET /api/bookings/stats - Get venue owner dashboard stats
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view stats' },
        { status: 401 }
      );
    }

    // Only venue owners can view stats
    if (session.user.role !== 'venue') {
      return NextResponse.json(
        { error: 'Only venue owners can view booking stats' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all bookings for this venue owner
    const allBookings = await Booking.find({
      venueOwnerId: session.user.id,
    }).lean();

    // Calculate stats
    const totalBookings = allBookings.length;
    const pendingCount = allBookings.filter((b) => b.status === 'pending').length;
    const activeCount = allBookings.filter((b) => b.status === 'active').length;
    const confirmedCount = allBookings.filter((b) => b.status === 'confirmed').length;
    const completedCount = allBookings.filter((b) => b.status === 'completed').length;

    // Calculate total revenue (from completed and active bookings)
    const totalRevenue = allBookings
      .filter((b) => ['active', 'completed'].includes(b.status))
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingCount,
        activeCount,
        confirmedCount,
        completedCount,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Error fetching booking stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking stats' },
      { status: 500 }
    );
  }
}
