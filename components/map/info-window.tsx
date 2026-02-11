"use client";

import { InfoWindow as GoogleInfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InfoWindowProps {
  position: {
    lat: number;
    lng: number;
  };
  space: {
    id: string;
    name: string;
    location: string;
    price: number;
    priceUnit: string;
    rating: number;
    images: string[];
  };
  onClose: () => void;
}

export default function InfoWindow({ position, space, onClose }: InfoWindowProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/spaces/${space.id}`);
  };

  return (
    <GoogleInfoWindow position={position} onCloseClick={onClose}>
      <div className="max-w-[280px]">
        {space.images && space.images.length > 0 && (
          <img
            src={space.images[0]}
            alt={space.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
        )}
        <h3 className="font-semibold text-sm mb-1">{space.name}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {space.location}
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{space.rating}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">
              ₹{space.price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">/{space.priceUnit}</div>
          </div>
        </div>
        <Button onClick={handleViewDetails} className="w-full" size="sm">
          View Details
        </Button>
      </div>
    </GoogleInfoWindow>
  );
}
