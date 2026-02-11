"use client";

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MiniMapProps {
  location: string;
  name: string;
  // In production, these would be actual coordinates from the database
  center?: {
    lat: number;
    lng: number;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function MiniMap({ location, name, center }: MiniMapProps) {
  const router = useRouter();
  
  // Default center (Bangalore) if not provided
  const defaultCenter = {
    lat: parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT || '12.9716'),
    lng: parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG || '77.5946'),
  };

  const mapCenter = center || defaultCenter;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const handleViewOnMap = () => {
    router.push(`/spaces/map?lat=${mapCenter.lat}&lng=${mapCenter.lng}&zoom=15`);
  };

  if (loadError) {
    return (
      <div className="h-64 rounded-xl bg-card border flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Unable to load map</p>
          <p className="text-sm text-muted-foreground mt-1">{location}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-64 rounded-xl bg-card border flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-64 rounded-xl overflow-hidden border">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={14}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          <Marker
            position={mapCenter}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#6366F1',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 10,
            }}
          />
        </GoogleMap>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewOnMap}>
          View on Map
        </Button>
      </div>
    </div>
  );
}
