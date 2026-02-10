import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';

// GET /api/reviews - Get reviews for a specific space
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const skip = (page - 1) * limit;

    // Determine sort order
    let sortQuery: any = { createdAt: -1 }; // Default: newest first
    if (sort === 'highest') {
      sortQuery = { rating: -1, createdAt: -1 };
    }

    // Fetch reviews
    const reviews = await Review.find({ spaceId })
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Review.countDocuments({ spaceId });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a new review
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { spaceId, rating, comment } = body;

    // Validate required fields
    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment length
    if (comment && comment.length > 500) {
      return NextResponse.json(
        { error: 'Comment cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user has already reviewed this space
    const existingReview = await Review.findOne({
      spaceId,
      userId: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this space', review: existingReview },
        { status: 409 }
      );
    }

    // Create new review
    const review = await Review.create({
      spaceId,
      userId: session.user.id,
      userName: session.user.name,
      userRole: session.user.role,
      rating,
      comment: comment || undefined,
    });

    return NextResponse.json(
      { review, message: 'Review submitted successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
