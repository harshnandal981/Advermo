import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/email/preferences - Get user's email preferences
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const preferences = user.emailPreferences || {
      bookingUpdates: true,
      paymentReceipts: true,
      campaignReminders: true,
      marketing: false,
    };

    return NextResponse.json({ preferences });
  } catch (error: any) {
    console.error('Error fetching email preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/email/preferences - Update user's email preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingUpdates, paymentReceipts, campaignReminders, marketing } = body;

    // Validate preferences
    const preferences: any = {};
    
    if (typeof bookingUpdates === 'boolean') {
      preferences.bookingUpdates = bookingUpdates;
    }
    
    if (typeof paymentReceipts === 'boolean') {
      preferences.paymentReceipts = paymentReceipts;
    }
    
    if (typeof campaignReminders === 'boolean') {
      preferences.campaignReminders = campaignReminders;
    }
    
    if (typeof marketing === 'boolean') {
      preferences.marketing = marketing;
    }

    if (Object.keys(preferences).length === 0) {
      return NextResponse.json(
        { error: 'No valid preferences provided' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          'emailPreferences.bookingUpdates': preferences.bookingUpdates !== undefined 
            ? preferences.bookingUpdates 
            : true,
          'emailPreferences.paymentReceipts': preferences.paymentReceipts !== undefined 
            ? preferences.paymentReceipts 
            : true,
          'emailPreferences.campaignReminders': preferences.campaignReminders !== undefined 
            ? preferences.campaignReminders 
            : true,
          'emailPreferences.marketing': preferences.marketing !== undefined 
            ? preferences.marketing 
            : false,
        },
      },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Email preferences updated successfully',
      preferences: user.emailPreferences,
    });
  } catch (error: any) {
    console.error('Error updating email preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update email preferences' },
      { status: 500 }
    );
  }
}
