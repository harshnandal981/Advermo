import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for geocoding results
const geocodeCache = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address is required',
        },
        { status: 400 }
      );
    }

    // Check cache first
    if (geocodeCache.has(address)) {
      return NextResponse.json({
        success: true,
        data: geocodeCache.get(address),
        cached: true,
      });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Maps API key not configured',
        },
        { status: 500 }
      );
    }

    // Call Google Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address not found',
        },
        { status: 404 }
      );
    }

    const result = data.results[0];
    const location = result.geometry.location;

    const geocodeResult = {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address,
    };

    // Cache the result
    geocodeCache.set(address, geocodeResult);

    return NextResponse.json({
      success: true,
      data: geocodeResult,
    });
  } catch (error: any) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to geocode address',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
