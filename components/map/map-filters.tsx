"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { AdSpaceType } from '@/types';

interface MapFiltersProps {
  onFilterChange: (filters: any) => void;
  className?: string;
}

const venueTypes = ['Café', 'Gym', 'Mall', 'College', 'Transit', 'Restaurant', 'Co-working'];
const adFormats: { label: string; value: AdSpaceType }[] = [
  { label: 'Poster', value: 'poster' },
  { label: 'Digital Screen', value: 'screen' },
  { label: 'Table Tent', value: 'table-tent' },
  { label: 'Counter', value: 'counter' },
  { label: 'Menu', value: 'menu' },
  { label: 'Outdoor', value: 'outdoor' },
];

export default function MapFilters({ onFilterChange, className = '' }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState(10); // km
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<AdSpaceType[]>([]);
  const [minRating, setMinRating] = useState(0);

  const toggleVenue = (venue: string) => {
    const updated = selectedVenues.includes(venue)
      ? selectedVenues.filter((v) => v !== venue)
      : [...selectedVenues, venue];
    setSelectedVenues(updated);
    applyFilters({ venues: updated });
  };

  const toggleFormat = (format: AdSpaceType) => {
    const updated = selectedFormats.includes(format)
      ? selectedFormats.filter((f) => f !== format)
      : [...selectedFormats, format];
    setSelectedFormats(updated);
    applyFilters({ formats: updated });
  };

  const applyFilters = (updates: any = {}) => {
    onFilterChange({
      radius: (updates.radius || radius) * 1000, // Convert to meters
      priceRange: updates.priceRange || priceRange,
      venueTypes: updates.venues || selectedVenues,
      adFormats: updates.formats || selectedFormats,
      minRating: updates.rating !== undefined ? updates.rating : minRating,
    });
  };

  const clearFilters = () => {
    setRadius(10);
    setPriceRange([0, 100000]);
    setSelectedVenues([]);
    setSelectedFormats([]);
    setMinRating(0);
    onFilterChange({
      radius: 10000,
      priceRange: [0, 100000],
      venueTypes: [],
      adFormats: [],
      minRating: 0,
    });
  };

  const activeFilterCount =
    (selectedVenues.length > 0 ? 1 : 0) +
    (selectedFormats.length > 0 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0);

  return (
    <div className={className}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="bg-white dark:bg-gray-800 shadow-lg"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-14 left-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Radius Slider */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Radius: {radius}km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setRadius(val);
                applyFilters({ radius: val });
              }}
              className="w-full"
            />
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => {
                  const range: [number, number] = [parseInt(e.target.value) || 0, priceRange[1]];
                  setPriceRange(range);
                  applyFilters({ priceRange: range });
                }}
                className="w-1/2 px-2 py-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => {
                  const range: [number, number] = [priceRange[0], parseInt(e.target.value) || 100000];
                  setPriceRange(range);
                  applyFilters({ priceRange: range });
                }}
                className="w-1/2 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>

          {/* Venue Types */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Venue Types</label>
            <div className="space-y-1">
              {venueTypes.map((venue) => (
                <label key={venue} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedVenues.includes(venue)}
                    onChange={() => toggleVenue(venue)}
                    className="mr-2"
                  />
                  <span className="text-sm">{venue}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ad Formats */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Ad Formats</label>
            <div className="space-y-1">
              {adFormats.map((format) => (
                <label key={format.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(format.value)}
                    onChange={() => toggleFormat(format.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{format.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setMinRating(val);
                applyFilters({ rating: val });
              }}
              className="w-full"
            />
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
