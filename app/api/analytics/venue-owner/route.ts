import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import AdSpace from '@/lib/models/AdSpace';
import { 
  aggregateRevenueByDate, 
  aggregateBookingsByDate, 
  calculateGrowth,
  calculateOccupancyRate,
  generateOccupancyHeatmap,
  getTopPerformingSpaces,
  calculateAverageBookingValue,
  calculateAverageDuration,
  getAdFormatDistribution,
  filterBookingsByDateRange
} from '@/lib/analytics/helpers';
import { startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';

// GET /api/analytics/venue-owner - Get venue owner analytics
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

    // Only venue owners can access this endpoint
    if (session.user.role !== 'venue') {
      return NextResponse.json(
        { error: 'Only venue owners can view this analytics' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const spaceIdFilter = searchParams.get('spaceId');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Default date range: last 90 days
    const endDate = endDateParam ? parseISO(endDateParam) : new Date();
    const startDate = startDateParam ? parseISO(startDateParam) : subMonths(endDate, 3);

    // Fetch all bookings for this venue owner
    const bookingQuery: any = { venueOwnerId: session.user.id };
    
    if (spaceIdFilter) {
      bookingQuery.spaceId = spaceIdFilter;
    }

    const allBookings = await Booking.find(bookingQuery).lean();
    
    // Filter by date range
    const bookings = filterBookingsByDateRange(allBookings, startDate, endDate);

    // Fetch venue owner's spaces
    const spaces = await AdSpace.find({ ownerId: session.user.id }).lean();
    const spacesFormatted = spaces.map(space => ({
      id: space._id.toString(),
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
    }));

    // Calculate revenue metrics
    const paidBookings = bookings.filter(b => b.isPaid);
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    // This month revenue
    const thisMonthStart = startOfMonth(new Date());
    const thisMonthEnd = endOfMonth(new Date());
    const thisMonthBookings = paidBookings.filter(b => {
      const paidDate = b.paidAt ? new Date(b.paidAt) : new Date(b.createdAt);
      return paidDate >= thisMonthStart && paidDate <= thisMonthEnd;
    });
    const thisMonthRevenue = thisMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Last month revenue
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const lastMonthBookings = paidBookings.filter(b => {
      const paidDate = b.paidAt ? new Date(b.paidAt) : new Date(b.createdAt);
      return paidDate >= lastMonthStart && paidDate <= lastMonthEnd;
    });
    const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const revenueGrowth = calculateGrowth(thisMonthRevenue, lastMonthRevenue);

    // Revenue chart data
    const revenueChartData = aggregateRevenueByDate(bookings, 'day');

    // Calculate booking metrics
    const bookingCounts = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // Bookings chart data
    const bookingsChartData = aggregateBookingsByDate(bookings, 'day');

    // Calculate space metrics
    const totalReviews = spacesFormatted.reduce((sum, s) => sum + s.reviewCount, 0);
    const averageRating = spacesFormatted.length > 0
      ? spacesFormatted.reduce((sum, s) => sum + s.rating, 0) / spacesFormatted.length
      : 0;

    // Top performing spaces
    const topPerforming = getTopPerformingSpaces(spacesFormatted, bookings, 5);

    // Calculate occupancy metrics
    const totalDaysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalAvailableDays = totalDaysInPeriod * spacesFormatted.length;
    const occupancyRate = calculateOccupancyRate(bookings, totalAvailableDays);

    // Occupancy heatmap
    const heatmapData = generateOccupancyHeatmap(bookings, startDate, endDate);

    // Ad format distribution
    const adFormatDistribution = getAdFormatDistribution(bookings, spacesFormatted);

    // General metrics
    const averageBookingValue = calculateAverageBookingValue(bookings);
    const averageDuration = calculateAverageDuration(bookings);
    
    // Conversion rate (placeholder - would need view tracking)
    const conversionRate = 0;
    
    // Response time (placeholder - would need to track response timestamps)
    const responseTime = 0;

    // Return analytics data
    return NextResponse.json({
      success: true,
      data: {
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: revenueGrowth.value,
          chartData: revenueChartData,
        },
        bookings: {
          ...bookingCounts,
          chartData: bookingsChartData,
        },
        spaces: {
          total: spacesFormatted.length,
          averageRating,
          totalReviews,
          topPerforming,
        },
        occupancy: {
          rate: occupancyRate,
          heatmapData,
        },
        adFormats: {
          distribution: adFormatDistribution,
        },
        metrics: {
          averageBookingValue,
          averageDuration,
          conversionRate,
          responseTime,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching venue owner analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
