import Link from "next/link";
import Image from "next/image";
import { AdSpace } from "@/types";
import { MapPin, Users, Star, Eye } from "lucide-react";
import { formatPrice, formatPriceUnit } from "@/lib/utils";

interface SpaceCardProps {
  space: AdSpace;
}

export default function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space.id}`}>
      <div className="group rounded-2xl overflow-hidden bg-card border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 md:h-56 overflow-hidden bg-muted">
          <Image
            src={space.images[0]}
            alt={space.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {space.featured && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              Featured
            </div>
          )}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium capitalize">
            {space.placement}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title & Location */}
          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{space.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{space.location}</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{space.dailyFootfall.toLocaleString('en-IN')}/day</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{(space.monthlyImpressions / 1000).toFixed(0)}K/mo</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{space.rating}</span>
            <span className="text-muted-foreground">({space.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(space.price)}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatPriceUnit(space.priceUnit)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
