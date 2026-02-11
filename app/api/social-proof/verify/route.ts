import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

/**
 * POST /api/social-proof/verify
 * Submit verification request
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

    // Only venue owners can verify
    if (session.user.role !== 'venue') {
      return NextResponse.json(
        { success: false, error: 'Only venue owners can submit verification requests' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { verificationType, documents, businessDetails } = body;

    // Validate input
    if (!verificationType) {
      return NextResponse.json(
        { success: false, error: 'Verification type is required' },
        { status: 400 }
      );
    }

    const validTypes = ['identity', 'business'];
    if (!validTypes.includes(verificationType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification type. Must be identity or business' },
        { status: 400 }
      );
    }

    // For business verification, require business details
    if (verificationType === 'business' && !businessDetails) {
      return NextResponse.json(
        { success: false, error: 'Business details are required for business verification' },
        { status: 400 }
      );
    }

    // Update user with verification request
    const updateData: any = {
      verificationType,
      verificationStatus: 'pending',
    };

    if (documents && documents.length > 0) {
      updateData.verificationDocuments = documents;
    }

    if (businessDetails) {
      updateData.businessDetails = businessDetails;
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Send email notification to admin for review
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Verification request submitted successfully',
      status: 'pending',
      user: {
        id: user._id,
        verificationType: user.verificationType,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error: any) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit verification request',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
