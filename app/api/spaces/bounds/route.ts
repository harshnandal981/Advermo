import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdSpace from '@/lib/models/AdSpace';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    
    // Parse bounding box parameters
    const north = parseFloat(searchParams.get('north') || '');
    const south = parseFloat(searchParams.get('south') || '');
    const east = parseFloat(searchParams.get('east') || '');
    const west = parseFloat(searchParams.get('west') || '');

    // Validate parameters
    if (isNaN(north) || isNaN(south) || isNaN(east) || isNaN(west)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid bounding box parameters',
        },
        { status: 400 }
      );
    }

    // Query spaces within bounding box
    const spaces = await AdSpace.find({
      'location.coordinates.1': { $gte: south, $lte: north }, // latitude
      'location.coordinates.0': { $gte: west, $lte: east },   // longitude
    })
      .limit(500)
      .lean();

    return NextResponse.json({
      success: true,
      count: spaces.length,
      data: spaces,
    });
  } catch (error: any) {
    console.error('Bounds query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch spaces',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
