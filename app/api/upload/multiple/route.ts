import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { validateFileType, validateFileSize, validateFileCount } from '@/lib/utils/upload';
import connectDB from '@/lib/mongodb';
import Upload from '@/lib/models/Upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload/multiple
 * Upload multiple images to Cloudinary
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

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'spaces';
    const resourceType = formData.get('resourceType') as string || 'space';
    const resourceId = formData.get('resourceId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate file count
    const countValidation = validateFileCount(files.length);
    if (!countValidation.valid) {
      return NextResponse.json(
        { error: countValidation.error },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      const typeValidation = validateFileType(file.type);
      if (!typeValidation.valid) {
        return NextResponse.json(
          { error: `${file.name}: ${typeValidation.error}` },
          { status: 400 }
        );
      }

      const sizeValidation = validateFileSize(file.size);
      if (!sizeValidation.valid) {
        return NextResponse.json(
          { error: `${file.name}: ${sizeValidation.error}` },
          { status: 400 }
        );
      }
    }

    // Upload all files in parallel
    const uploadPromises = files.map(async (file, index) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadToCloudinary(buffer, {
          folder,
          resourceType: 'image',
        });

        return {
          success: true,
          fileName: file.name,
          data: {
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            order: index,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          fileName: file.name,
          error: error.message || 'Upload failed',
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    // Connect to database and save successful uploads
    await connectDB();
    
    const successfulUploads = results.filter((r) => r.success);
    if (successfulUploads.length > 0) {
      const uploadRecords = successfulUploads.map((result) => ({
        userId,
        resourceType,
        ...(resourceId && { resourceId }),
        publicId: result.data!.publicId,
        url: result.data!.url,
        secureUrl: result.data!.url,
        format: result.data!.format,
        width: result.data!.width,
        height: result.data!.height,
        bytes: result.data!.bytes,
        uploadedAt: new Date(),
      }));

      await Upload.insertMany(uploadRecords);
    }

    // Return results
    return NextResponse.json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        successful: successfulUploads.length,
        failed: results.length - successfulUploads.length,
      },
    });
  } catch (error: any) {
    console.error('Multiple upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload images' },
      { status: 500 }
    );
  }
}
