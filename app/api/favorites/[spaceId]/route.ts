import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';
import User from '@/lib/models/User';

// DELETE /api/favorites/[spaceId] - Remove space from favorites
export async function DELETE(
  req: NextRequest,
  { params }: { params: { spaceId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to remove favorites' },
        { status: 401 }
      );
    }

    const { spaceId } = params;

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete the favorite
    const favorite = await Favorite.findOneAndDelete({
      userId: session.user.id,
      spaceId,
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    // Decrement user's favorites count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { favoritesCount: -1 },
    });

    return NextResponse.json({
      message: 'Favorite removed successfully',
      spaceId,
    });
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
