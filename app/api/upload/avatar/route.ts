import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { validateFileType, validateFileSize } from '@/lib/utils/upload';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Upload from '@/lib/models/Upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload/avatar
 * Upload user profile picture
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const typeValidation = validateFileType(file.type);
    if (!typeValidation.valid) {
      return NextResponse.json(
        { error: typeValidation.error },
        { status: 400 }
      );
    }

    const sizeValidation = validateFileSize(file.size);
    if (!sizeValidation.valid) {
      return NextResponse.json(
        { error: sizeValidation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old avatar from Cloudinary if exists
    if (user.profileImage?.publicId) {
      try {
        await deleteFromCloudinary(user.profileImage.publicId);
        await Upload.deleteOne({ publicId: user.profileImage.publicId });
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
        // Continue anyway
      }
    }

    // Upload new avatar with square crop and face detection
    const result = await uploadToCloudinary(buffer, {
      folder: 'profiles',
      resourceType: 'image',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    // Update user profile
    user.profileImage = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    // Also update legacy image field
    user.image = result.secure_url;
    await user.save();

    // Save upload record
    const uploadRecord = new Upload({
      userId,
      resourceType: 'profile',
      resourceId: userId,
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      uploadedAt: new Date(),
    });
    await uploadRecord.save();

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
