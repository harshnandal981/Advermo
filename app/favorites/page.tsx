"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Favorite, FavoritesStats } from "@/types";
import FavoritesHeader from "@/components/favorites/favorites-header";
import FavoritesList from "@/components/favorites/favorites-list";
import FavoritesEmptyState from "@/components/favorites/favorites-empty-state";
import ComparisonBar from "@/components/favorites/comparison-bar";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [stats, setStats] = useState<FavoritesStats>({
    totalCount: 0,
    totalValue: 0,
    topVenueType: "",
    averagePrice: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchFavorites();
      fetchStats();
    }
  }, [status, sortBy]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/favorites?sort=${sortBy}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/favorites/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRemove = async (spaceId: string) => {
    try {
      const res = await fetch(`/api/favorites/${spaceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.spaceId !== spaceId));
        setSelectedSpaces((prev) => prev.filter((id) => id !== spaceId));
        fetchStats(); // Update stats
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to remove all favorites?')) {
      return;
    }

    try {
      const promises = favorites.map((fav) =>
        fetch(`/api/favorites/${fav.spaceId}`, { method: 'DELETE' })
      );
      await Promise.all(promises);
      setFavorites([]);
      setSelectedSpaces([]);
      fetchStats();
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  const handleSelect = (spaceId: string) => {
    setSelectedSpaces((prev) => {
      if (prev.includes(spaceId)) {
        return prev.filter((id) => id !== spaceId);
      } else if (prev.length < 3) {
        return [...prev, spaceId];
      }
      return prev; // Max 3 spaces
    });
  };

  const handleCompare = () => {
    if (selectedSpaces.length >= 2) {
      router.push(`/favorites/compare?spaces=${selectedSpaces.join(',')}`);
    }
  };

  const handleClearSelection = () => {
    setSelectedSpaces([]);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <FavoritesHeader
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearAll={handleClearAll}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {favorites.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        <FavoritesList
          favorites={favorites}
          viewMode={viewMode}
          onRemove={handleRemove}
          onSelect={handleSelect}
          selectedSpaces={selectedSpaces}
        />
      )}

      <ComparisonBar
        selectedCount={selectedSpaces.length}
        onClear={handleClearSelection}
        onCompare={handleCompare}
      />
    </div>
  );
}
