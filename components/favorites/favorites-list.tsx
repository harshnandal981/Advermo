"use client";

import { Favorite } from "@/types";
import FavoriteCard from "./favorite-card";

interface FavoritesListProps {
  favorites: Favorite[];
  viewMode: "grid" | "list";
  onRemove?: (spaceId: string) => void;
  onSelect?: (spaceId: string) => void;
  selectedSpaces?: string[];
}

export default function FavoritesList({
  favorites,
  viewMode,
  onRemove,
  onSelect,
  selectedSpaces = [],
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return null;
  }

  const gridClass = viewMode === "grid"
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    : "flex flex-col gap-4";

  return (
    <div className={gridClass}>
      {favorites.map((favorite) => (
        <FavoriteCard
          key={favorite._id}
          favorite={favorite}
          onRemove={onRemove}
          onSelect={onSelect}
          isSelected={selectedSpaces.includes(favorite.spaceId)}
        />
      ))}
    </div>
  );
}
