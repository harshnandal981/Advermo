import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Activity from '@/lib/models/Activity';

/**
 * GET /api/social-proof/activities
 * Get recent activities for live notifications
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');

    // Build query
    const query: any = {
      isPublic: true,
      // Only show activities from last 24 hours
      timestamp: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    };

    if (city) {
      query.city = city;
    }

    if (type) {
      query.type = type;
    }

    // Get recent activities
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 50))
      .select('-__v')
      .lean();

    return NextResponse.json({
      success: true,
      activities,
      count: activities.length,
    });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activities',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
