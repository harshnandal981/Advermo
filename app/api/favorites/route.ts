import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/lib/models/Favorite';
import User from '@/lib/models/User';
import { adSpaces } from '@/lib/data';

// POST /api/favorites - Add space to favorites
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to add favorites' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { spaceId, notes } = body;

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    // Validate space exists
    const space = adSpaces.find((s) => s.id === spaceId);
    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      );
    }

    await connectDB();

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: session.user.id,
      spaceId,
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Space already in favorites' },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await Favorite.create({
      userId: session.user.id,
      spaceId,
      notes: notes || undefined,
    });

    // Increment user's favorites count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { favoritesCount: 1 },
    });

    // Return with populated space data
    const favoriteWithSpace = {
      _id: favorite._id.toString(),
      userId: favorite.userId.toString(),
      spaceId: favorite.spaceId,
      space,
      addedAt: favorite.addedAt,
      notes: favorite.notes,
    };

    return NextResponse.json(favoriteWithSpace, { status: 201 });
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// GET /api/favorites - Get user's favorites list
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view favorites' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'recent';
    const city = searchParams.get('city');
    const venueType = searchParams.get('venueType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectDB();

    // Build query
    let sortQuery: any = {};
    switch (sort) {
      case 'recent':
        sortQuery = { addedAt: -1 };
        break;
      case 'price-low':
      case 'price-high':
      case 'rating':
        // We'll sort after populating with space data
        sortQuery = { addedAt: -1 };
        break;
      default:
        sortQuery = { addedAt: -1 };
    }

    // Get favorites
    const favorites = await Favorite.find({ userId: session.user.id })
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await Favorite.countDocuments({ userId: session.user.id });

    // Populate space data from adSpaces
    let favoritesWithSpaces = favorites.map((fav: any) => {
      const space = adSpaces.find((s) => s.id === fav.spaceId);
      return {
        _id: fav._id.toString(),
        userId: fav.userId.toString(),
        spaceId: fav.spaceId,
        space,
        addedAt: fav.addedAt,
        notes: fav.notes,
      };
    }).filter((fav) => fav.space); // Filter out favorites with deleted spaces

    // Apply filters
    if (city) {
      favoritesWithSpaces = favoritesWithSpaces.filter(
        (fav) => fav.space?.location.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (venueType) {
      favoritesWithSpaces = favoritesWithSpaces.filter(
        (fav) => fav.space?.venueType.toLowerCase() === venueType.toLowerCase()
      );
    }

    // Apply sorting based on space data
    switch (sort) {
      case 'price-low':
        favoritesWithSpaces.sort((a, b) => (a.space?.price || 0) - (b.space?.price || 0));
        break;
      case 'price-high':
        favoritesWithSpaces.sort((a, b) => (b.space?.price || 0) - (a.space?.price || 0));
        break;
      case 'rating':
        favoritesWithSpaces.sort((a, b) => (b.space?.rating || 0) - (a.space?.rating || 0));
        break;
    }

    return NextResponse.json({
      favorites: favoritesWithSpaces,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}
