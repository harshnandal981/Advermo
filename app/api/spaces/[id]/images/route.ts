import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import AdSpace from '@/lib/models/AdSpace';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/spaces/[id]/images
 * Update space images (reorder, set primary, remove)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Parse request body
    const body = await request.json();
    const { imageDetails, primaryImageId } = body;

    if (!imageDetails || !Array.isArray(imageDetails)) {
      return NextResponse.json(
        { error: 'imageDetails array is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the space
    const space = await AdSpace.findById(params.id);
    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (space.ownerId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized. You do not own this space.' },
        { status: 403 }
      );
    }

    // Update imageDetails
    space.imageDetails = imageDetails.map((img: any, index: number) => ({
      url: img.url,
      publicId: img.publicId,
      width: img.width,
      height: img.height,
      format: img.format,
      uploadedAt: img.uploadedAt || new Date(),
      isPrimary: primaryImageId ? img.publicId === primaryImageId : index === 0,
      order: index,
    }));

    // Also update legacy images array for backward compatibility
    space.images = imageDetails.map((img: any) => img.url);

    await space.save();

    return NextResponse.json({
      success: true,
      data: {
        imageDetails: space.imageDetails,
        images: space.images,
      },
    });
  } catch (error: any) {
    console.error('Update images error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update images' },
      { status: 500 }
    );
  }
}
