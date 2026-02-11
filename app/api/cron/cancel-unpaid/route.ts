import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

// GET /api/cron/cancel-unpaid - Auto-cancel unpaid bookings
export async function GET(req: NextRequest) {
  try {
    // Verify this is a Vercel Cron request (optional but recommended)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find bookings that:
    // 1. Are in 'pending' status
    // 2. Are not paid (isPaid = false)
    // 3. Were created more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const unpaidBookings = await Booking.find({
      status: 'pending',
      isPaid: false,
      createdAt: { $lt: twentyFourHoursAgo },
    });

    const cancelledCount = unpaidBookings.length;

    // Update all unpaid bookings to cancelled
    if (cancelledCount > 0) {
      await Booking.updateMany(
        {
          status: 'pending',
          isPaid: false,
          createdAt: { $lt: twentyFourHoursAgo },
        },
        {
          $set: {
            status: 'cancelled',
            notes: 'Automatically cancelled due to non-payment within 24 hours',
          },
        }
      );

      console.log(`Auto-cancelled ${cancelledCount} unpaid bookings`);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${cancelledCount} unpaid bookings`,
      cancelledCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in cancel-unpaid cron:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process unpaid bookings' },
      { status: 500 }
    );
  }
}
