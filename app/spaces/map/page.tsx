"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MapView from '@/components/map/map-view';
import SpaceMarker from '@/components/map/space-marker';
import InfoWindow from '@/components/map/info-window';
import MapControls from '@/components/map/map-controls';
import MapFilters from '@/components/map/map-filters';
import LocationSearch from '@/components/map/location-search';
import { adSpaces } from '@/lib/data';
import { MapCenter } from '@/types';

export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial center from URL or use default (Bangalore)
  const initialLat = parseFloat(searchParams.get('lat') || process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT || '12.9716');
  const initialLng = parseFloat(searchParams.get('lng') || process.env.NEXT_PUBLIC_MAP_DEFAULT_CENTER_LNG || '77.5946');
  
  const [center, setCenter] = useState<MapCenter>({
    lat: initialLat,
    lng: initialLng,
  });
  const [zoom, setZoom] = useState(parseInt(searchParams.get('zoom') || '12'));
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [filters, setFilters] = useState<any>({});

  // Memoize mock coordinates for spaces to prevent re-calculation on every render
  const spacesWithCoordinates = useMemo(() => {
    return adSpaces.map((space, index) => ({
      ...space,
      coordinates: {
        // Use deterministic position based on space ID to avoid jumping markers
        lat: center.lat + ((index % 5) - 2) * 0.02,
        lng: center.lng + (Math.floor(index / 5) % 5 - 2) * 0.02,
      },
    }));
  }, [center.lat, center.lng]);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          setZoom(14);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(currentZoom + 1);
      setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 12;
      map.setZoom(currentZoom - 1);
      setZoom(currentZoom - 1);
    }
  };

  const handleToggleView = () => {
    router.push('/spaces');
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setCenter({ lat: location.lat, lng: location.lng });
    setZoom(13);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // In production, this would trigger an API call to fetch filtered spaces
  };

  const selectedSpace = selectedSpaceId 
    ? spacesWithCoordinates.find(s => s.id === selectedSpaceId)
    : null;

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        <MapFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Right Controls */}
      <MapControls
        onMyLocation={handleMyLocation}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleView={handleToggleView}
        view="map"
      />

      {/* Results Counter */}
      <div className="absolute top-4 right-48 z-10 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
        <span className="text-sm font-medium">
          {spacesWithCoordinates.length} spaces found
        </span>
      </div>

      {/* Map */}
      <MapView
        center={center}
        zoom={zoom}
        onMapLoad={setMap}
      >
        {spacesWithCoordinates.map((space) => (
          <SpaceMarker
            key={space.id}
            position={space.coordinates}
            spaceId={space.id}
            price={space.price}
            verified={space.verified}
            isSelected={selectedSpaceId === space.id}
            onClick={() => setSelectedSpaceId(space.id)}
          />
        ))}

        {selectedSpace && (
          <InfoWindow
            position={selectedSpace.coordinates}
            space={{
              id: selectedSpace.id,
              name: selectedSpace.name,
              location: selectedSpace.location,
              price: selectedSpace.price,
              priceUnit: selectedSpace.priceUnit,
              rating: selectedSpace.rating,
              images: selectedSpace.images,
            }}
            onClose={() => setSelectedSpaceId(null)}
          />
        )}
      </MapView>
    </div>
  );
}
