import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking, { IBooking } from '@/lib/models/Booking';
import { sendEmail } from '@/lib/email/service';
import { shouldSendEmail } from '@/lib/email/helpers';
import { adSpaces } from '@/lib/data';
import CampaignStartingSoonEmail from '@/emails/campaign-starting-soon';
import CampaignStartedEmail from '@/emails/campaign-started';
import CampaignCompletedEmail from '@/emails/campaign-completed';

// POST /api/cron/campaign-reminders - Send campaign reminders (runs daily)
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (for Vercel Cron Jobs)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    let emailsSent = 0;
    const errors: string[] = [];

    // 1. Find campaigns starting tomorrow
    const startingTomorrow = (await Booking.find({
      status: 'confirmed',
      startDate: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow,
      },
    }).lean()) as unknown as IBooking[];

    for (const booking of startingTomorrow) {
      try {
        const space = adSpaces.find((s) => s.id === booking.spaceId);
        const spaceName = space?.name || booking.spaceName;
        const spaceLocation = space?.location || '';

        // Email to brand
        const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'campaign_starting_soon');
        if (shouldEmailBrand) {
          await sendEmail({
            to: booking.brandEmail,
            subject: `Campaign Starts Tomorrow! 📍 ${spaceName}`,
            react: CampaignStartingSoonEmail({
              booking: booking as any,
              recipient: { name: booking.brandName, role: 'brand' },
              otherParty: { name: 'Venue Owner', email: booking.venueOwnerEmail },
            }),
            template: 'campaign_starting_soon',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_starting_soon',
            },
          });
          emailsSent++;
        }

        // Email to venue owner
        if (booking.venueOwnerEmail && booking.venueOwnerEmail !== 'owner@example.com') {
          await sendEmail({
            to: booking.venueOwnerEmail,
            subject: `Campaign Starts Tomorrow! 📍 ${spaceName}`,
            react: CampaignStartingSoonEmail({
              booking: booking as any,
              recipient: { name: 'Venue Owner', role: 'venue' },
              otherParty: { name: booking.brandName, email: booking.brandEmail },
            }),
            template: 'campaign_starting_soon',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_starting_soon',
            },
          });
          emailsSent++;
        }
      } catch (error: any) {
        errors.push(`Error sending starting-soon email for booking ${booking._id}: ${error.message}`);
      }
    }

    // 2. Find campaigns starting today (activate them)
    const startingToday = await Booking.find({
      status: 'confirmed',
      startDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    for (const booking of startingToday) {
      try {
        // Update status to active
        booking.status = 'active';
        await booking.save();

        const space = adSpaces.find((s) => s.id === booking.spaceId);
        const spaceName = space?.name || booking.spaceName;

        // Email to brand
        const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'campaign_started');
        if (shouldEmailBrand) {
          await sendEmail({
            to: booking.brandEmail,
            subject: 'Your Campaign is Now Live! 🚀',
            react: CampaignStartedEmail({
              booking: booking.toObject() as any,
              recipient: { name: booking.brandName, role: 'brand' },
            }),
            template: 'campaign_started',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_started',
            },
          });
          emailsSent++;
        }

        // Email to venue owner
        if (booking.venueOwnerEmail && booking.venueOwnerEmail !== 'owner@example.com') {
          await sendEmail({
            to: booking.venueOwnerEmail,
            subject: 'Campaign is Now Live! 🚀',
            react: CampaignStartedEmail({
              booking: booking.toObject() as any,
              recipient: { name: 'Venue Owner', role: 'venue' },
            }),
            template: 'campaign_started',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_started',
            },
          });
          emailsSent++;
        }
      } catch (error: any) {
        errors.push(`Error sending started email for booking ${booking._id}: ${error.message}`);
      }
    }

    // 3. Find campaigns that ended yesterday (mark as completed and send review request)
    const completedYesterday = await Booking.find({
      status: 'active',
      endDate: {
        $gte: yesterday,
        $lt: today,
      },
    });

    for (const booking of completedYesterday) {
      try {
        // Update status to completed
        booking.status = 'completed';
        await booking.save();

        const space = adSpaces.find((s) => s.id === booking.spaceId);
        const spaceName = space?.name || booking.spaceName;

        // Email to brand
        const shouldEmailBrand = await shouldSendEmail(booking.brandId, 'campaign_completed');
        if (shouldEmailBrand) {
          await sendEmail({
            to: booking.brandEmail,
            subject: 'Campaign Completed! Leave a Review ⭐',
            react: CampaignCompletedEmail({
              booking: booking.toObject() as any,
              recipient: { name: booking.brandName, role: 'brand' },
              otherParty: { name: 'Venue Owner' },
            }),
            template: 'campaign_completed',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_completed',
            },
          });
          emailsSent++;
        }

        // Email to venue owner
        if (booking.venueOwnerEmail && booking.venueOwnerEmail !== 'owner@example.com') {
          await sendEmail({
            to: booking.venueOwnerEmail,
            subject: 'Campaign Completed! Leave a Review ⭐',
            react: CampaignCompletedEmail({
              booking: booking.toObject() as any,
              recipient: { name: 'Venue Owner', role: 'venue' },
              otherParty: { name: booking.brandName },
            }),
            template: 'campaign_completed',
            metadata: {
              bookingId: booking._id.toString(),
              type: 'campaign_completed',
            },
          });
          emailsSent++;
        }
      } catch (error: any) {
        errors.push(`Error sending completed email for booking ${booking._id}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      startingTomorrow: startingTomorrow.length,
      startingToday: startingToday.length,
      completedYesterday: completedYesterday.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Error in campaign reminders cron:', error);
    return NextResponse.json(
      { error: 'Failed to process campaign reminders', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return POST(req);
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
