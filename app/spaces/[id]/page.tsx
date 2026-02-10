import { adSpaces } from "@/lib/data";
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
  MessageCircle,
  Eye,
  Target,
  Clock
} from "lucide-react";
import { formatPrice, formatPriceUnit } from "@/lib/utils";
import ReviewSummary from "@/components/reviews/review-summary";
import ReviewForm from "@/components/reviews/review-form";
import ReviewsList from "@/components/reviews/reviews-list";

export default async function SpaceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adSpace = adSpaces.find((s) => s.id === id);

  if (!adSpace) {
    notFound();
  }

  // Calculate CPM
  const cpm = (adSpace.price / adSpace.monthlyImpressions * 1000).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={adSpace.images[0]}
              alt={adSpace.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {adSpace.images.slice(1, 5).map((image, index) => (
              <div key={index} className="relative h-44 md:h-60 rounded-2xl overflow-hidden">
                <Image
                  src={image}
                  alt={`${adSpace.name} - ${index + 2}`}
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
                  {adSpace.venueType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{adSpace.rating}</span>
                  <span className="text-muted-foreground">({adSpace.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{adSpace.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{adSpace.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">About this ad space</h2>
              <p className="text-muted-foreground leading-relaxed">{adSpace.description}</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Daily Footfall</div>
                  <div className="text-muted-foreground">{adSpace.dailyFootfall.toLocaleString()} people/day</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Eye className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Monthly Impressions</div>
                  <div className="text-muted-foreground">{adSpace.monthlyImpressions.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Target className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Demographics</div>
                  <div className="text-muted-foreground">{adSpace.demographics}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Peak Hours</div>
                  <div className="text-muted-foreground">{adSpace.peakHours}</div>
                </div>
              </div>
            </div>

            {/* Advertising Details */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Advertising Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-xl bg-card border">
                <div>
                  <div className="font-semibold mb-1">Ad Format</div>
                  <div className="text-muted-foreground">{adSpace.placement}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Venue Type</div>
                  <div className="text-muted-foreground">{adSpace.venueType}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Location</div>
                  <div className="text-muted-foreground">{adSpace.location}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">CPM</div>
                  <div className="text-muted-foreground">₹{cpm}</div>
                </div>
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
                  <p className="text-sm text-muted-foreground mt-1">{adSpace.location}</p>
                </div>
              </div>
            </div>

            {/* Venue Owner Info */}
            <div className="p-6 rounded-xl bg-card border">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">Venue Owner</h3>
                    {adSpace.verified && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{adSpace.rating} rating</span>
                  </div>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Venue Owner
                  </Button>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <ReviewSummary spaceId={id} />
              <ReviewForm spaceId={id} />
              <ReviewsList spaceId={id} />
            </div>
          </div>

          {/* Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border shadow-lg space-y-4">
              <h3 className="text-xl font-semibold mb-2">Book this Ad Spot</h3>
              <div className="pb-4 border-b">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(adSpace.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPriceUnit(adSpace.priceUnit)}
                  </span>
                </div>
                <div className="text-sm text-primary font-medium mb-1">
                  CPM: ₹{cpm}
                </div>
                <div className="text-sm text-muted-foreground">
                  {adSpace.monthlyImpressions.toLocaleString()} monthly impressions
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Campaign Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Campaign Duration</label>
                  <select className="w-full px-3 py-2 border rounded-lg bg-background">
                    <option>1 week</option>
                    <option>2 weeks</option>
                    <option>1 month</option>
                    <option>3 months</option>
                    <option>6 months</option>
                  </select>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Reserve Ad Spot
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
