import { spaces } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Star, 
  CheckCircle2, 
  Calendar,
  Shield,
  MessageCircle
} from "lucide-react";
import { formatPrice, formatPriceUnit } from "@/lib/utils";

export default async function SpaceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = spaces.find((s) => s.id === id);

  if (!space) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={space.images[0]}
              alt={space.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {space.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative h-44 md:h-60 rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${space.name} - ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                  {space.type}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{space.rating}</span>
                  <span className="text-muted-foreground">({space.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{space.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{space.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">About this space</h2>
              <p className="text-muted-foreground leading-relaxed">{space.description}</p>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Capacity</div>
                <div className="text-muted-foreground">Up to {space.capacity} people</div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {space.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar (UI Mock) */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Availability</h2>
              <div className="p-8 rounded-xl bg-card border text-center">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Calendar view will be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred dates and times
                </p>
              </div>
            </div>

            {/* Map (Mock) */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="h-64 rounded-xl bg-card border flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Map view will be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-1">{space.location}</p>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{space.host.name}</h3>
                    {space.host.verified && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{space.host.rating} host rating</span>
                  </div>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Host
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border shadow-lg space-y-4">
              <div className="pb-4 border-b">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(space.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPriceUnit(space.priceUnit)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {space.availability ? "Available now" : "Currently unavailable"}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Check-in Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration</label>
                  <select className="w-full px-3 py-2 border rounded-lg bg-background">
                    <option>1 {space.priceUnit}</option>
                    <option>2 {space.priceUnit}s</option>
                    <option>3 {space.priceUnit}s</option>
                    <option>1 week</option>
                  </select>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Request Booking
              </Button>

              <Button className="w-full" variant="outline" size="lg">
                Save for Later
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                You won&apos;t be charged yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
