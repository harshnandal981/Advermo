import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import AdSpace from '@/lib/models/AdSpace';
import { calculateGrowth } from '@/lib/analytics/helpers';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

// GET /api/analytics/dashboard-stats - Get quick dashboard stats
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

    await connectDB();

    const isVenue = session.user.role === 'venue';
    const isBrand = session.user.role === 'brand';

    if (!isVenue && !isBrand) {
      return NextResponse.json(
        { error: 'Invalid user role' },
        { status: 403 }
      );
    }

    // Build query based on role
    const bookingQuery = isVenue 
      ? { venueOwnerId: session.user.id }
      : { brandId: session.user.id };

    // Fetch bookings
    const allBookingsRaw = await Booking.find(bookingQuery).lean();
    const allBookings = allBookingsRaw as any[];

    // This month metrics
    const thisMonthStart = startOfMonth(new Date());
    const thisMonthEnd = endOfMonth(new Date());
    const thisMonthBookings = allBookings.filter(b => {
      const createdAt = new Date(b.createdAt);
      return createdAt >= thisMonthStart && createdAt <= thisMonthEnd;
    });

    // Last month metrics
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const lastMonthBookings = allBookings.filter(b => {
      const createdAt = new Date(b.createdAt);
      return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
    });

    // Calculate stats for venue owners
    if (isVenue) {
      const spacesRaw = await AdSpace.find({ ownerId: session.user.id }).lean();
      const spaces = spacesRaw as any[];

      const thisMonthRevenue = thisMonthBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const lastMonthRevenue = lastMonthBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const revenueGrowth = calculateGrowth(thisMonthRevenue, lastMonthRevenue);

      const activeBookings = allBookings.filter(
        b => b.status === 'active' || b.status === 'confirmed'
      ).length;

      const pendingBookings = allBookings.filter(b => b.status === 'pending').length;

      const totalRevenue = allBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          thisMonthRevenue,
          revenueGrowth: revenueGrowth.value,
          revenueGrowthTrend: revenueGrowth.trend,
          activeBookings,
          pendingBookings,
          totalSpaces: spaces.length,
          totalBookings: allBookings.length,
        },
      });
    }

    // Calculate stats for brands
    if (isBrand) {
      const thisMonthSpending = thisMonthBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const lastMonthSpending = lastMonthBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      const spendingGrowth = calculateGrowth(thisMonthSpending, lastMonthSpending);

      const activeCampaigns = allBookings.filter(b => b.status === 'active').length;
      const totalCampaigns = allBookings.length;

      const totalSpent = allBookings
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return NextResponse.json({
        success: true,
        stats: {
          totalSpent,
          thisMonthSpending,
          spendingGrowth: spendingGrowth.value,
          spendingGrowthTrend: spendingGrowth.trend,
          activeCampaigns,
          totalCampaigns,
          completedCampaigns: allBookings.filter(b => b.status === 'completed').length,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
