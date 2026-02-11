"use client";

import { Button } from '@/components/ui/button';
import { Navigation, Plus, Minus, Map as MapIcon, List } from 'lucide-react';

interface MapControlsProps {
  onMyLocation?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleView?: () => void;
  view?: 'map' | 'list';
}

export default function MapControls({
  onMyLocation,
  onZoomIn,
  onZoomOut,
  onToggleView,
  view = 'map',
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {onMyLocation && (
        <Button
          onClick={onMyLocation}
          size="icon"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50"
          title="My Location"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      )}

      {onZoomIn && (
        <Button
          onClick={onZoomIn}
          size="icon"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </Button>
      )}

      {onZoomOut && (
        <Button
          onClick={onZoomOut}
          size="icon"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </Button>
      )}

      {onToggleView && (
        <Button
          onClick={onToggleView}
          size="icon"
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50"
          title={view === 'map' ? 'List View' : 'Map View'}
        >
          {view === 'map' ? (
            <List className="w-4 h-4" />
          ) : (
            <MapIcon className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}
