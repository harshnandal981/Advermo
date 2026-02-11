"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdSpace } from "@/types";
import { adSpaces } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users, Star, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [spaces, setSpaces] = useState<AdSpace[]>([]);

  useEffect(() => {
    const spaceIds = searchParams.get('spaces')?.split(',') || [];
    const selectedSpaces = adSpaces.filter((space) => spaceIds.includes(space.id));
    setSpaces(selectedSpaces);
  }, [searchParams]);

  if (spaces.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Select at least 2 spaces to compare</h1>
          <Button onClick={() => router.push('/favorites')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Favorites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push('/favorites')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Favorites
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Compare Ad Spaces</h1>

      {/* Mobile: Swipeable Cards */}
      <div className="md:hidden space-y-6">
        {spaces.map((space) => (
          <div key={space.id} className="bg-card rounded-xl border p-4">
            <Image
              src={space.images[0] || "/placeholder-space.jpg"}
              alt={space.name}
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{space.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Venue Type:</span>
                <span className="font-semibold">{space.venueType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-semibold">₹{space.price.toLocaleString()}/{space.priceUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-semibold flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  {space.rating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Footfall:</span>
                <span className="font-semibold">{space.dailyFootfall.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-right">{space.location}</span>
              </div>
            </div>
            <Link href={`/spaces/${space.id}`}>
              <Button className="w-full mt-4">View Details</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop: Comparison Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left bg-muted/50 border-b font-semibold">Feature</th>
              {spaces.map((space) => (
                <th key={space.id} className="p-4 border-b min-w-[250px]">
                  <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={space.images[0] || "/placeholder-space.jpg"}
                      alt={space.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{space.name}</h3>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Venue Type</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">{space.venueType}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Price</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">
                  <div className="text-xl font-bold">₹{space.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">per {space.priceUnit}</div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Rating</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{space.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Daily Footfall</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{space.dailyFootfall.toLocaleString()}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Monthly Impressions</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center font-semibold">
                  {space.monthlyImpressions.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Location</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{space.location}</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Ad Space Type</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center capitalize">
                  {space.type.replace('-', ' ')}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Placement</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">{space.placement}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium bg-muted/30">Demographics</td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 border-b text-center">{space.demographics}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium bg-muted/30"></td>
              {spaces.map((space) => (
                <td key={space.id} className="p-4 text-center">
                  <Link href={`/spaces/${space.id}`}>
                    <Button className="w-full">View Details & Book</Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
