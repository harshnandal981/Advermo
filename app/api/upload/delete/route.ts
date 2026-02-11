import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import Upload from '@/lib/models/Upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * DELETE /api/upload/delete
 * Delete an image from Cloudinary and database
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Get public ID from query params
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the upload record
    const uploadRecord = await Upload.findOne({ publicId });

    if (!uploadRecord) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (uploadRecord.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not own this image.' },
        { status: 403 }
      );
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // Delete from database
    await Upload.deleteOne({ publicId });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
