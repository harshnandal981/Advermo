# Google Maps Integration - Implementation Guide

## Overview

This document provides a comprehensive guide to the Google Maps integration implemented in the Advermo space rental marketplace. The integration includes interactive maps, geospatial search, location-based filtering, and advanced search capabilities.

## Features Implemented

### 1. Google Maps Setup
- Environment variable configuration for API keys
- Support for Maps JavaScript API, Places API, and Geocoding API
- Configurable default map center and zoom levels

### 2. Database Schema
- **AdSpace Model** with geospatial support (`lib/models/AdSpace.ts`)
  - Location field with GeoJSON Point type
  - 2dsphere index for efficient geospatial queries
  - Address, city, state, country fields
  - Coordinate storage in [longitude, latitude] format

### 3. API Routes

#### `/api/spaces/search` (GET)
Geospatial search with comprehensive filtering:
- **Location-based**: `lat`, `lng`, `radius` (meters)
- **Filters**: `city`, `minPrice`, `maxPrice`, `venueType`, `adFormat`, `minFootfall`, `maxFootfall`, `minRating`
- **Sorting**: `distance`, `price`, `rating`, `footfall`
- Uses MongoDB `$geoNear` aggregation for distance-based queries
- Returns up to 500 results with distance from center point

#### `/api/spaces/geocode` (POST)
Convert addresses to coordinates:
- Input: `address` string
- Uses Google Geocoding API
- In-memory caching to reduce API calls
- Returns: `{ lat, lng, formattedAddress }`

#### `/api/spaces/bounds` (GET)
Fetch spaces within map bounding box:
- Parameters: `north`, `south`, `east`, `west`
- Used when map is dragged or zoomed
- Efficient for dynamic map updates

### 4. Map Components

#### `MapView` (`components/map/map-view.tsx`)
Main map container with Google Maps JavaScript API:
- Lazy loading of Google Maps script
- Custom map styling (POI labels hidden)
- Supports children (markers, info windows)
- Event handlers for map interactions
- Error and loading states

#### `SpaceMarker` (`components/map/space-marker.tsx`)
Individual space markers:
- Color-coded by price tier:
  - Green: Budget (< ₹10k)
  - Blue: Mid-range (₹10k-25k)
  - Purple: Premium (> ₹25k)
  - Gold: Verified spaces
- Bounce animation for selected marker
- Hover effects
- Safe google.maps availability checking

#### `InfoWindow` (`components/map/info-window.tsx`)
Popup on marker click:
- Space image, name, location
- Rating and price display
- "View Details" button
- Compact design (max 300px)

#### `LocationSearch` (`components/map/location-search.tsx`)
Autocomplete search:
- Google Places Autocomplete
- Biased to India
- Debounced search (300ms)
- Returns coordinates on selection

#### `MapControls` (`components/map/map-controls.tsx`)
Custom map controls:
- "My Location" button (geolocation)
- Zoom in/out buttons
- Map/List view toggle

#### `MapFilters` (`components/map/map-filters.tsx`)
Filter sidebar:
- Radius slider (1km - 50km)
- Price range inputs
- Venue type checkboxes
- Ad format checkboxes
- Minimum rating slider
- Active filter count badge
- "Clear All Filters" button

#### `MiniMap` (`components/map/mini-map.tsx`)
Mini map for detail pages:
- 256px height, responsive width
- Single marker for space location
- "View on Map" button
- Loading and error states

### 5. Pages

#### `/spaces` (Updated)
- Added "Map View" button in header
- Toggles to dedicated map view
- Maintains current filter state

#### `/spaces/map` (New)
- Full-screen map view
- Location search bar
- Filter sidebar
- Map controls (zoom, location, view toggle)
- Results counter
- Marker clustering for 50+ spaces (future)
- URL-based state for shareable links

#### `/spaces/[id]` (Updated)
- Mini map showing space location
- Interactive or static map option
- "View on Map" button

### 6. Utility Functions

#### `lib/utils/geo.ts`
- `calculateDistance()`: Haversine formula for distance calculation
- `formatDistance()`: Format meters to "Xkm away" or "Xm away"

#### `lib/utils/map.ts`
- `getMapBounds()`: Calculate bounds for array of spaces
- `isWithinBounds()`: Check if point is within bounds

### 7. Type Definitions

All types in `types/index.ts`:
- `Location`: GeoJSON point with address fields
- `MapCenter`: Simple lat/lng object
- `MapBounds`: North, south, east, west coordinates
- `SearchFilters`: Comprehensive search filter object
- `RazorpayOptions`, `RazorpayInstance`: Properly typed Razorpay integration

## Environment Variables

Add to `.env.local`:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Default Map Configuration
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT=12.9716
NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG=77.5946
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
```

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project "Advermo"
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to "APIs & Services" → "Credentials"
5. Create API Key
6. (Optional but recommended) Restrict API key to your domain
7. Copy the API key to `.env.local`

### 2. Install Dependencies

Already installed:
```bash
npm install @react-google-maps/api @googlemaps/markerclusterer use-places-autocomplete
```

### 3. Database Setup

The AdSpace model is already created. To use it:

1. Ensure MongoDB connection is configured
2. When creating new ad spaces, include location data:
```typescript
{
  location: {
    type: 'Point',
    coordinates: [longitude, latitude], // Note: lng, lat order!
    address: "123 Street Name",
    city: "Bangalore",
    state: "Karnataka",
    zipCode: "560001",
    country: "India"
  }
}
```

3. The 2dsphere index is automatically created

## Usage Examples

### Client-Side Search
```typescript
const response = await fetch(
  `/api/spaces/search?lat=12.9716&lng=77.5946&radius=5000&minPrice=10000&maxPrice=50000`
);
const { data } = await response.json();
```

### Geocoding
```typescript
const response = await fetch('/api/spaces/geocode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: 'Koramangala, Bangalore' })
});
const { data } = await response.json();
// data: { lat, lng, formattedAddress }
```

### Using Map Components
```tsx
import MapView from '@/components/map/map-view';
import SpaceMarker from '@/components/map/space-marker';

<MapView center={{ lat: 12.9716, lng: 77.5946 }} zoom={12}>
  {spaces.map(space => (
    <SpaceMarker
      key={space.id}
      position={space.coordinates}
      spaceId={space.id}
      price={space.price}
      verified={space.verified}
      onClick={() => handleMarkerClick(space.id)}
    />
  ))}
</MapView>
```

## Performance Considerations

1. **Marker Clustering**: Not yet implemented but recommended for 50+ markers
2. **Geocoding Cache**: In-memory cache reduces API calls
3. **Query Limits**: Search limited to 500 results
4. **Debouncing**: Location search debounced to 300ms
5. **Lazy Loading**: Google Maps script loaded on demand

## Google Maps API Limits (Free Tier)

- Maps loads: 28,000/month
- Geocoding: 40,000 requests/month
- Places Autocomplete: 1,000 requests/month

After free tier, costs apply. Monitor usage in Google Cloud Console.

## Future Enhancements

- [ ] Marker clustering for better performance
- [ ] Custom map styles (light/dark mode)
- [ ] Street View integration
- [ ] Directions to venue
- [ ] Heat map view
- [ ] Drawing tools for custom search areas
- [ ] Save favorite locations
- [ ] Mobile optimizations (swipeable bottom sheet)

## Security Best Practices

1. **API Key Restriction**: Restrict to your domain in Google Cloud Console
2. **Environment Variables**: Never commit `.env.local` to Git
3. **Input Validation**: All API routes validate inputs
4. **Rate Limiting**: Consider adding rate limits to geocoding endpoint
5. **CORS**: API routes are protected by Next.js CORS policies

## Troubleshooting

### Map doesn't load
- Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify API is enabled in Google Cloud Console
- Check browser console for errors
- Ensure domain is allowed (if API key is restricted)

### Markers don't appear
- Verify spaces have valid `coordinates` in database
- Check coordinates are in [lng, lat] order (not lat, lng)
- Ensure coordinates are within valid ranges (-180 to 180, -90 to 90)

### Geocoding fails
- Check API key has Geocoding API enabled
- Verify you haven't exceeded quota
- Check address format is valid

### Performance issues
- Implement marker clustering
- Reduce number of markers displayed
- Use viewport-based loading (load only visible markers)

## Support

For issues or questions:
1. Check this documentation
2. Review Google Maps API documentation
3. Check browser console for errors
4. Verify environment variables are set correctly

## Related Documentation

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/)
