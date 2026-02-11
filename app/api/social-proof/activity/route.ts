import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Activity from '@/lib/models/Activity';
import { anonymizeName } from '@/lib/social-proof/helpers';

/**
 * POST /api/social-proof/activity
 * Log a user activity
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { type, resourceId, resourceName, city } = body;

    // Validate input
    if (!type || !resourceId || !resourceName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, resourceId, resourceName',
        },
        { status: 400 }
      );
    }

    // Validate activity type
    const validTypes = ['booking_created', 'space_viewed', 'review_posted', 'verification_completed'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid activity type' },
        { status: 400 }
      );
    }

    // Create activity record
    const activity = await Activity.create({
      type,
      userId: session.user.id,
      userName: anonymizeName(session.user.name || 'User'),
      resourceId,
      resourceName,
      timestamp: new Date(),
      isPublic: true, // Can be configured per activity type
      city,
    });

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error: any) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create activity',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
