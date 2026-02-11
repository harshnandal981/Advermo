import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdSpace from '@/lib/models/AdSpace';
import User from '@/lib/models/User';
import { calculateSpaceBadges } from '@/lib/social-proof/trust-score';

/**
 * GET /api/cron/update-badges
 * Automated daily cron job to update space badges
 * Should be called by Vercel Cron or similar service
 */
export async function GET(req: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all spaces
    const spaces = await AdSpace.find().lean();
    let updatedCount = 0;

    // Process each space
    for (const space of spaces) {
      try {
        // Get owner info for response time badge
        const owner = await User.findById(space.ownerId).lean();

        // Calculate badges
        const badges = calculateSpaceBadges({
          stats: space.stats,
          rating: space.rating,
          reviewCount: space.reviewCount,
          owner: owner ? { responseTime: owner.responseTime } : undefined,
        });

        // Add verified badge if space is verified
        if (space.verified) {
          badges.push('verified');
        }

        // Update space
        await AdSpace.findByIdAndUpdate(
          space._id,
          { $set: { badges } }
        );

        updatedCount++;
      } catch (error) {
        console.error(`Error updating badges for space ${space._id}:`, error);
        // Continue with next space
      }
    }

    // Reset weekly stats (optional - run this on Sunday/Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 1) {
      // Reset weekly counters on Sunday or Monday
      await AdSpace.updateMany(
        {},
        {
          $set: {
            'stats.viewsThisWeek': 0,
            'stats.bookingsThisWeek': 0,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated badges for ${updatedCount} spaces`,
      totalSpaces: spaces.length,
      updatedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in update-badges cron:', error);
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
