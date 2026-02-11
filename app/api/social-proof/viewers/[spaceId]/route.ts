import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ViewCounter from '@/lib/models/ViewCounter';

/**
 * GET /api/social-proof/viewers/[spaceId]
 * Get current viewer count for a space
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { spaceId: string } }
) {
  try {
    await connectDB();

    const { spaceId } = params;

    if (!spaceId) {
      return NextResponse.json(
        { success: false, error: 'Space ID is required' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Count active viewers (last seen within 5 minutes)
    const count = await ViewCounter.countDocuments({
      spaceId,
      lastSeenAt: {
        $gte: new Date(now.getTime() - 5 * 60 * 1000),
      },
    });

    // Set cache header (30 seconds)
    return NextResponse.json(
      {
        success: true,
        count,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Error getting viewer count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get viewer count',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
