import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';

// POST /api/favorites/bulk-check - Check multiple spaces at once
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({});
    }

    const body = await req.json();
    const { spaceIds } = body;

    if (!Array.isArray(spaceIds)) {
      return NextResponse.json(
        { error: 'spaceIds must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all favorites for this user and these spaces
    const favorites = await Favorite.find({
      userId: session.user.id,
      spaceId: { $in: spaceIds },
    }).select('spaceId');

    // Build result object
    const result: Record<string, boolean> = {};
    spaceIds.forEach((spaceId) => {
      result[spaceId] = favorites.some((fav) => fav.spaceId === spaceId);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error checking favorites:', error);
    return NextResponse.json({});
  }
}
