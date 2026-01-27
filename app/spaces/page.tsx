"use client";

import { useState } from "react";
import { spaces, amenitiesList } from "@/lib/data";
import { SpaceType, SortOption } from "@/types";
import SpaceCard from "@/components/ui/space-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const sortOptions: SortOption[] = [
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Popular", value: "popularity" },
];

const spaceTypes: { label: string; value: SpaceType }[] = [
  { label: "Workspace", value: "workspace" },
  { label: "Event Hall", value: "event" },
  { label: "Studio", value: "studio" },
  { label: "Co-Living", value: "stay" },
];

export default function SpacesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<SpaceType[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState<string>("popularity");

  const toggleType = (type: SpaceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Filter and sort spaces
  let filteredSpaces = spaces.filter((space) => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(space.type);
    const priceMatch = space.price >= priceRange[0] && space.price <= priceRange[1];
    const capacityMatch = space.capacity >= minCapacity;
    const amenitiesMatch =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => space.amenities.includes(amenity));

    return typeMatch && priceMatch && capacityMatch && amenitiesMatch;
  });

  // Sort spaces
  filteredSpaces = filteredSpaces.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popularity":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setPriceRange([0, 200000]);
    setMinCapacity(0);
  };

  const activeFilterCount =
    selectedTypes.length + selectedAmenities.length + (minCapacity > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Explore Spaces</h1>
          <p className="text-muted-foreground">
            Showing {filteredSpaces.length} of {spaces.length} spaces
          </p>
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

              {/* Space Type */}
              <div className="space-y-3">
                <h3 className="font-medium">Space Type</h3>
                <div className="space-y-2">
                  {spaceTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{type.label}</span>
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
                    max="200000"
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

              {/* Capacity */}
              <div className="space-y-3">
                <h3 className="font-medium">Minimum Capacity</h3>
                <input
                  type="number"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h3 className="font-medium">Amenities</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
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
                {filteredSpaces.length} spaces found
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

            {/* Spaces Grid */}
            {filteredSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl font-medium mb-2">No spaces found</p>
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
                <h3 className="font-medium">Space Type</h3>
                <div className="space-y-2">
                  {spaceTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Amenities</h3>
                <div className="space-y-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
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
