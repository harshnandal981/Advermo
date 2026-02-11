"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star, Calendar } from "lucide-react";
import { Favorite } from "@/types";
import { Button } from "@/components/ui/button";
import FavoriteButton from "./favorite-button";
import { formatDistanceToNow } from "date-fns";

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove?: (spaceId: string) => void;
  onSelect?: (spaceId: string) => void;
  isSelected?: boolean;
}

export default function FavoriteCard({
  favorite,
  onRemove,
  onSelect,
  isSelected = false,
}: FavoriteCardProps) {
  const { space, addedAt, notes } = favorite;

  if (!space) {
    return null;
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(space.id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(space.id);
  };

  return (
    <div
      className={`group relative bg-card rounded-xl overflow-hidden border transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton spaceId={space.id} size="sm" />
      </div>

      <Link href={`/spaces/${space.id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={space.images[0] || "/placeholder-space.jpg"}
            alt={space.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {space.featured && (
            <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Added Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>Added {formatDistanceToNow(new Date(addedAt), { addSuffix: true })}</span>
          </div>

          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{space.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{space.venueType}</p>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{space.location}</span>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <span>{space.dailyFootfall.toLocaleString()}/day</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{space.rating}</span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="bg-muted rounded-lg p-2 mb-3">
              <p className="text-xs text-muted-foreground line-clamp-2">{notes}</p>
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-2xl font-bold">₹{space.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/{space.priceUnit}</span>
            </div>
            <Button size="sm" onClick={(e) => e.stopPropagation()}>
              Book Now
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
