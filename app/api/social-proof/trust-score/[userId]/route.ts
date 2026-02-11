import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { calculateTrustScore } from '@/lib/social-proof/trust-score';

/**
 * GET /api/social-proof/trust-score/[userId]
 * Calculate and return trust score for a user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate trust score
    const trustScore = calculateTrustScore({
      emailVerified: (user as any).emailVerified,
      phoneVerified: (user as any).phoneVerified,
      isVerified: (user as any).isVerified,
      verificationType: (user as any).verificationType,
      responseTime: (user as any).responseTime,
      acceptanceRate: (user as any).acceptanceRate,
      createdAt: (user as any).createdAt,
      totalBookingsHosted: (user as any).totalBookingsHosted,
      totalBookingsMade: (user as any).totalBookingsMade,
      rating: (user as any).rating,
    });

    // Update user's trust score in database
    await User.findByIdAndUpdate(userId, {
      trustScore: trustScore.total,
    });

    return NextResponse.json({
      success: true,
      score: trustScore.total,
      breakdown: trustScore.breakdown,
    });
  } catch (error: any) {
    console.error('Error calculating trust score:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate trust score',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
