"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adSpaces } from "@/lib/data";
import { AdSpaceType, SortOption } from "@/types";
import SpaceCard from "@/components/ui/space-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Map } from "lucide-react";

const sortOptions: SortOption[] = [
  { label: "Highest Footfall", value: "footfall" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Best CPM", value: "cpm" },
  { label: "Highest Rated", value: "rating" },
  { label: "Trending Venues", value: "popularity" },
];

const adFormats: { label: string; value: AdSpaceType }[] = [
  { label: "Poster Wall", value: "poster" },
  { label: "Digital Screen", value: "screen" },
  { label: "Table Tent", value: "table-tent" },
  { label: "Counter Branding", value: "counter" },
  { label: "Menu Placement", value: "menu" },
  { label: "Outdoor Billboard", value: "outdoor" },
];

const venueTypes: string[] = [
  "Café",
  "Gym",
  "Mall",
  "College",
  "Transit",
  "Restaurant",
  "Co-working",
];

const footfallRanges: { label: string; min: number; max: number }[] = [
  { label: "0 - 1,000/day", min: 0, max: 1000 },
  { label: "1,000 - 5,000/day", min: 1000, max: 5000 },
  { label: "5,000 - 10,000/day", min: 5000, max: 10000 },
  { label: "10,000+/day", min: 10000, max: Infinity },
];

export default function SpacesPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<AdSpaceType[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400000]);
  const [selectedFootfall, setSelectedFootfall] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity");

  const toggleFormat = (format: AdSpaceType) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((t) => t !== format) : [...prev, format]
    );
  };

  const toggleVenue = (venue: string) => {
    setSelectedVenues((prev) =>
      prev.includes(venue) ? prev.filter((v) => v !== venue) : [...prev, venue]
    );
  };

  // Filter and sort ad spaces
  let filteredSpaces = adSpaces.filter((adSpace) => {
    const formatMatch = selectedFormats.length === 0 || selectedFormats.includes(adSpace.type);
    const venueMatch = selectedVenues.length === 0 || selectedVenues.includes(adSpace.venueType);
    const priceMatch = adSpace.price >= priceRange[0] && adSpace.price <= priceRange[1];
    
    let footfallMatch = true;
    if (selectedFootfall !== null) {
      const range = footfallRanges[selectedFootfall];
      footfallMatch = adSpace.dailyFootfall >= range.min && adSpace.dailyFootfall <= range.max;
    }

    return formatMatch && venueMatch && priceMatch && footfallMatch;
  });

  // Sort ad spaces
  filteredSpaces = filteredSpaces.sort((a, b) => {
    switch (sortBy) {
      case "footfall":
        return b.dailyFootfall - a.dailyFootfall;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "cpm":
        const cpmA = (a.price / a.monthlyImpressions) * 1000;
        const cpmB = (b.price / b.monthlyImpressions) * 1000;
        return cpmA - cpmB;
      case "rating":
        return b.rating - a.rating;
      case "popularity":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedFormats([]);
    setSelectedVenues([]);
    setPriceRange([0, 400000]);
    setSelectedFootfall(null);
  };

  const activeFilterCount =
    selectedFormats.length + selectedVenues.length + (selectedFootfall !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Explore Ad Spaces</h1>
              <p className="text-muted-foreground mb-2">
                Find high-traffic placements across premium venues
              </p>
              <p className="text-muted-foreground">
                Showing {filteredSpaces.length} of {adSpaces.length} ad spaces
              </p>
            </div>
            <Button
              onClick={() => router.push('/spaces/map')}
              variant="outline"
              className="gap-2"
            >
              <Map className="w-4 h-4" />
              Map View
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Ad Format */}
              <div className="space-y-3">
                <h3 className="font-medium">Ad Format</h3>
                <div className="space-y-2">
                  {adFormats.map((format) => (
                    <label key={format.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format.value)}
                        onChange={() => toggleFormat(format.value)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{format.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Venue Type */}
              <div className="space-y-3">
                <h3 className="font-medium">Venue Type</h3>
                <div className="space-y-2">
                  {venueTypes.map((venue) => (
                    <label key={venue} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedVenues.includes(venue)}
                        onChange={() => toggleVenue(venue)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{venue}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Daily Footfall */}
              <div className="space-y-3">
                <h3 className="font-medium">Daily Footfall</h3>
                <div className="space-y-2">
                  {footfallRanges.map((range, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="footfall"
                        checked={selectedFootfall === index}
                        onChange={() => setSelectedFootfall(selectedFootfall === index ? null : index)}
                        className="rounded-full border-gray-300"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h3 className="font-medium">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="400000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Up to ₹{priceRange[1].toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>

            {/* Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {filteredSpaces.length} ad spaces found
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ad Spaces Grid */}
            {filteredSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl font-medium mb-2">No ad spaces found</p>
                <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-x-0 bottom-0 bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filter content as desktop */}
              <div className="space-y-3">
                <h3 className="font-medium">Ad Format</h3>
                <div className="space-y-2">
                  {adFormats.map((format) => (
                    <label key={format.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format.value)}
                        onChange={() => toggleFormat(format.value)}
                      />
                      <span className="text-sm">{format.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Venue Type</h3>
                <div className="space-y-2">
                  {venueTypes.map((venue) => (
                    <label key={venue} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedVenues.includes(venue)}
                        onChange={() => toggleVenue(venue)}
                      />
                      <span className="text-sm">{venue}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Daily Footfall</h3>
                <div className="space-y-2">
                  {footfallRanges.map((range, index) => (
                    <label key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="footfall-mobile"
                        checked={selectedFootfall === index}
                        onChange={() => setSelectedFootfall(selectedFootfall === index ? null : index)}
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="400000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Up to ₹{priceRange[1].toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={() => setShowFilters(false)} className="flex-1">
                  Show Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
