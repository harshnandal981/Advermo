import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';
import { adSpaces } from '@/lib/data';

// GET /api/favorites/stats - Get favorites statistics
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

    // Get all favorites for this user
    const favorites = await Favorite.find({ userId: session.user.id }).lean();

    const totalCount = favorites.length;

    if (totalCount === 0) {
      return NextResponse.json({
        totalCount: 0,
        totalValue: 0,
        topVenueType: '',
        averagePrice: 0,
      });
    }

    // Populate space data and calculate stats
    const favoritesWithSpaces = favorites
      .map((fav) => {
        const space = adSpaces.find((s) => s.id === fav.spaceId);
        return space;
      })
      .filter(Boolean);

    // Calculate total value
    const totalValue = favoritesWithSpaces.reduce((sum, space) => sum + (space?.price || 0), 0);

    // Calculate average price
    const averagePrice = totalValue / favoritesWithSpaces.length;

    // Find most common venue type
    const venueTypeCounts: Record<string, number> = {};
    favoritesWithSpaces.forEach((space) => {
      if (space?.venueType) {
        venueTypeCounts[space.venueType] = (venueTypeCounts[space.venueType] || 0) + 1;
      }
    });

    const topVenueType = Object.entries(venueTypeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

    return NextResponse.json({
      totalCount,
      totalValue,
      topVenueType,
      averagePrice: Math.round(averagePrice),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
