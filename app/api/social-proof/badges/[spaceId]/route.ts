import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdSpace from '@/lib/models/AdSpace';
import User from '@/lib/models/User';
import { calculateSpaceBadges } from '@/lib/social-proof/trust-score';

/**
 * PATCH /api/social-proof/badges/[spaceId]
 * Update space badges (automated badge assignment)
 */
export async function PATCH(
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

    // Get space with owner info
    const space = await AdSpace.findById(spaceId).lean();

    if (!space) {
      return NextResponse.json(
        { success: false, error: 'Space not found' },
        { status: 404 }
      );
    }

    // Get owner info
    const owner = await User.findById((space as any).ownerId).lean();

    // Calculate badges
    const badges = calculateSpaceBadges({
      stats: (space as any).stats,
      rating: (space as any).rating,
      reviewCount: (space as any).reviewCount,
      owner: owner ? { responseTime: (owner as any).responseTime || 0 } : undefined,
    });

    // Add verified badge if space is verified
    if ((space as any).verified) {
      badges.push('verified');
    }

    // Update space with new badges
    const updatedSpace = await AdSpace.findByIdAndUpdate(
      spaceId,
      { $set: { badges } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      spaceId,
      badges,
      updatedSpace,
    });
  } catch (error: any) {
    console.error('Error updating badges:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update badges',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
