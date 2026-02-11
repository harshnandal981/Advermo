"use client";

import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MapCenter } from '@/types';

interface MapViewProps {
  center: MapCenter;
  zoom?: number;
  onMapLoad?: (map: google.maps.Map) => void;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  children?: React.ReactNode;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function MapView({
  center,
  zoom = 12,
  onMapLoad,
  onBoundsChanged,
  children,
}: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const handleLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
    if (onMapLoad) {
      onMapLoad(mapInstance);
    }
  };

  const handleBoundsChanged = () => {
    if (mapRef.current && onBoundsChanged) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        onBoundsChanged(bounds);
      }
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading maps</p>
          <p className="text-sm text-gray-500">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      onLoad={handleLoad}
      onBoundsChanged={handleBoundsChanged}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
    >
      {children}
    </GoogleMap>
  );
}
