import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdSpace from '@/lib/models/AdSpace';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseInt(searchParams.get('radius') || '10000'); // Default 10km in meters
    const city = searchParams.get('city');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
    const venueType = searchParams.get('venueType');
    const adFormat = searchParams.get('adFormat');
    const minFootfall = parseInt(searchParams.get('minFootfall') || '0');
    const maxFootfall = parseInt(searchParams.get('maxFootfall') || '999999999');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sort = searchParams.get('sort') || 'distance';
    
    let query: any = {};
    
    // Build query object
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    query.price = { $gte: minPrice, $lte: maxPrice };
    
    if (venueType) {
      query.venueType = venueType;
    }
    
    if (adFormat) {
      query.adSpaceType = adFormat;
    }
    
    query.dailyFootfall = { $gte: minFootfall, $lte: maxFootfall };
    
    if (minRating > 0) {
      query.rating = { $gte: minRating };
    }

    let spaces;
    
    // Use geospatial query if coordinates provided
    if (!isNaN(lat) && !isNaN(lng)) {
      spaces = await AdSpace.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [lng, lat], // [longitude, latitude]
            },
            distanceField: 'distance',
            maxDistance: radius,
            spherical: true,
            query: query,
          },
        },
        {
          $sort: sort === 'price' 
            ? { price: 1 } 
            : sort === 'rating' 
            ? { rating: -1 } 
            : sort === 'footfall'
            ? { dailyFootfall: -1 }
            : { distance: 1 }
        },
        {
          $limit: 500, // Limit to 500 results for performance
        },
      ]);
    } else {
      // Regular query without geospatial search
      const sortOption: any = 
        sort === 'price' ? { price: 1 } :
        sort === 'rating' ? { rating: -1 } :
        sort === 'footfall' ? { dailyFootfall: -1 } :
        { createdAt: -1 };
      
      spaces = await AdSpace.find(query)
        .sort(sortOption)
        .limit(500)
        .lean();
    }

    return NextResponse.json({
      success: true,
      count: spaces.length,
      data: spaces,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search spaces',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
