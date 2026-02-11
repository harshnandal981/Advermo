import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';

// GET /api/favorites/check/[spaceId] - Check if space is favorited
export async function GET(
  req: NextRequest,
  { params }: { params: { spaceId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ isFavorited: false });
    }

    const { spaceId } = params;

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if favorite exists
    const favorite = await Favorite.findOne({
      userId: session.user.id,
      spaceId,
    });

    return NextResponse.json({ isFavorited: !!favorite });
  } catch (error: any) {
    console.error('Error checking favorite:', error);
    return NextResponse.json({ isFavorited: false });
  }
}
