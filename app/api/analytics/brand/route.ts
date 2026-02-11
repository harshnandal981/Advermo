import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import AdSpace from '@/lib/models/AdSpace';
import { 
  aggregateRevenueByDate, 
  aggregateBookingsByDate,
  filterBookingsByDateRange
} from '@/lib/analytics/helpers';
import { startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';

// GET /api/analytics/brand - Get brand analytics
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view analytics' },
        { status: 401 }
      );
    }

    // Only brands can access this endpoint
    if (session.user.role !== 'brand') {
      return NextResponse.json(
        { error: 'Only brands can view this analytics' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Default date range: last 90 days
    const endDate = endDateParam ? parseISO(endDateParam) : new Date();
    const startDate = startDateParam ? parseISO(startDateParam) : subMonths(endDate, 3);

    // Fetch all bookings for this brand
    const allBookings = await Booking.find({ brandId: session.user.id }).lean();
    
    // Filter by date range
    const bookings = filterBookingsByDateRange(allBookings, startDate, endDate);

    // Campaign metrics
    const campaignCounts = {
      total: bookings.length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      totalSpent: bookings.filter(b => b.isPaid).reduce((sum, b) => sum + b.totalPrice, 0),
    };

    // Campaign chart data (bookings over time)
    const campaignChartData = aggregateBookingsByDate(bookings, 'day');

    // Spending metrics
    const paidBookings = bookings.filter(b => b.isPaid);
    const totalSpending = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // This month spending
    const thisMonthStart = startOfMonth(new Date());
    const thisMonthEnd = endOfMonth(new Date());
    const thisMonthSpending = paidBookings
      .filter(b => {
        const paidDate = b.paidAt ? new Date(b.paidAt) : new Date(b.createdAt);
        return paidDate >= thisMonthStart && paidDate <= thisMonthEnd;
      })
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // Spending by venue type
    const venueTypeSpending = new Map<string, number>();
    
    for (const booking of paidBookings) {
      const space = await AdSpace.findById(booking.spaceId).lean();
      if (space) {
        const venueType = space.venueType;
        const current = venueTypeSpending.get(venueType) || 0;
        venueTypeSpending.set(venueType, current + booking.totalPrice);
      }
    }

    const byVenueType = Array.from(venueTypeSpending.entries()).map(([type, amount]) => ({
      type,
      amount,
    }));

    // Spending chart data
    const spendingChartData = aggregateRevenueByDate(bookings, 'day');

    // Performance metrics
    // Calculate total impressions based on monthly impressions and duration
    let totalImpressions = 0;
    const spaceImpressions = new Map<string, { space: any; spent: number; impressions: number }>();

    for (const booking of bookings) {
      if (booking.status === 'cancelled' || booking.status === 'rejected') continue;

      const space = await AdSpace.findById(booking.spaceId).lean();
      if (space) {
        // Calculate impressions: (monthlyImpressions / 30) * duration
        const dailyImpressions = space.monthlyImpressions / 30;
        const bookingImpressions = dailyImpressions * booking.duration;
        totalImpressions += bookingImpressions;

        // Track per space
        const spaceId = space._id.toString();
        const current = spaceImpressions.get(spaceId) || {
          space: {
            id: spaceId,
            name: space.name,
            venueType: space.venueType,
            location: space.location.address,
            type: space.adSpaceType,
            placement: space.placement,
            dailyFootfall: space.dailyFootfall,
            monthlyImpressions: space.monthlyImpressions,
            demographics: space.demographics,
            price: space.price,
            priceUnit: space.priceUnit,
            images: space.images,
            description: space.description,
            peakHours: space.peakHours,
            rating: space.rating,
            reviewCount: space.reviewCount,
            featured: space.featured,
            verified: space.verified,
          },
          spent: 0,
          impressions: 0,
        };

        current.impressions += bookingImpressions;
        if (booking.isPaid) {
          current.spent += booking.totalPrice;
        }

        spaceImpressions.set(spaceId, current);
      }
    }

    // Calculate average CPM (Cost Per Thousand Impressions)
    const averageCPM = totalImpressions > 0 
      ? (totalSpending / totalImpressions) * 1000 
      : 0;

    // Get top venues by spending
    const topVenues = Array.from(spaceImpressions.values())
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Return analytics data
    return NextResponse.json({
      success: true,
      data: {
        campaigns: {
          ...campaignCounts,
          chartData: campaignChartData,
        },
        spending: {
          total: totalSpending,
          thisMonth: thisMonthSpending,
          byVenueType,
          chartData: spendingChartData,
        },
        performance: {
          totalImpressions: Math.round(totalImpressions),
          averageCPM: Math.round(averageCPM * 100) / 100,
          topVenues,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching brand analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
