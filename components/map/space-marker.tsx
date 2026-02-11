"use client";

import { Marker } from '@react-google-maps/api';

interface SpaceMarkerProps {
  position: {
    lat: number;
    lng: number;
  };
  spaceId: string;
  price: number;
  isSelected?: boolean;
  verified?: boolean;
  onClick?: () => void;
}

// Determine marker color based on price tier
function getMarkerColor(price: number, verified: boolean = false): string {
  if (verified) {
    return '#FFD700'; // Gold for verified
  }
  if (price < 10000) {
    return '#10B981'; // Green for budget
  } else if (price < 25000) {
    return '#3B82F6'; // Blue for mid-range
  } else {
    return '#8B5CF6'; // Purple for premium
  }
}

export default function SpaceMarker({
  position,
  spaceId,
  price,
  isSelected = false,
  verified = false,
  onClick,
}: SpaceMarkerProps) {
  const color = getMarkerColor(price, verified);
  
  // Create custom SVG icon
  const icon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: isSelected ? 1 : 0.8,
    strokeColor: verified ? '#FFD700' : '#FFFFFF',
    strokeWeight: isSelected ? 3 : 2,
    scale: isSelected ? 12 : 10,
  };

  return (
    <Marker
      position={position}
      onClick={onClick}
      icon={icon}
      animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
      zIndex={isSelected ? 1000 : undefined}
    />
  );
}
