"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoritesBadgeProps {
  className?: string;
}

export default function FavoritesBadge({ className }: FavoritesBadgeProps) {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchFavoritesCount();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const fetchFavoritesCount = async () => {
    try {
      const res = await fetch('/api/favorites/stats');
      const data = await res.json();
      setCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching favorites count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session?.user || isLoading) {
    return null;
  }

  return (
    <Link
      href="/favorites"
      className={cn(
        "relative p-2 rounded-lg hover:bg-accent transition-colors",
        className
      )}
      aria-label={`Favorites (${count})`}
    >
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
