import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ViewCounter from '@/lib/models/ViewCounter';

/**
 * POST /api/social-proof/track-view
 * Track a space view for real-time viewer counting
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { spaceId, sessionId } = body;

    // Validate input
    if (!spaceId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: spaceId, sessionId' },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    // Upsert view counter record
    await ViewCounter.findOneAndUpdate(
      { spaceId, sessionId },
      {
        $set: {
          lastSeenAt: now,
          expiresAt,
        },
      },
      { upsert: true, new: true }
    );

    // Count active viewers (last seen within 5 minutes)
    const activeViewers = await ViewCounter.countDocuments({
      spaceId,
      lastSeenAt: {
        $gte: new Date(now.getTime() - 5 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      viewerCount: activeViewers,
    });
  } catch (error: any) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track view',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
