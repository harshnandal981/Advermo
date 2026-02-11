"use client";

import { Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoritesStats } from "@/types";

interface FavoritesHeaderProps {
  stats: FavoritesStats;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onClearAll: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FavoritesHeader({
  stats,
  viewMode,
  onViewModeChange,
  onClearAll,
  sortBy,
  onSortChange,
}: FavoritesHeaderProps) {
  const { totalCount, totalValue } = stats;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{totalCount} {totalCount === 1 ? 'space' : 'spaces'}</span>
            {totalValue > 0 && (
              <>
                <span>•</span>
                <span>Total Value: ₹{totalValue.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {totalCount > 0 && (
          <Button variant="outline" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        )}
      </div>

      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card rounded-lg border">
          {/* Sort */}
          <div className="flex items-center gap-2 flex-1">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="flex-1 sm:flex-none bg-background border rounded-md px-3 py-1.5 text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
