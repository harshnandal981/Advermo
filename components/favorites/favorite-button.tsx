"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  spaceId: string;
  initialState?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  onAuthRequired?: () => void;
  className?: string;
}

export default function FavoriteButton({
  spaceId,
  initialState = false,
  size = "md",
  showCount = false,
  onAuthRequired,
  className,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if space is favorited on mount
  useEffect(() => {
    if (session?.user) {
      checkFavoriteStatus();
    } else {
      setIsChecking(false);
    }
  }, [session, spaceId]);

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/check/${spaceId}`);
      const data = await res.json();
      setIsFavorited(data.isFavorited || false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If not authenticated, trigger auth modal
    if (!session?.user) {
      onAuthRequired?.();
      return;
    }

    // Prevent double-click
    if (isLoading) return;

    setIsLoading(true);

    // Optimistic UI update
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);

    try {
      if (isFavorited) {
        // Remove from favorites
        const res = await fetch(`/api/favorites/${spaceId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to remove favorite');
        }
      } else {
        // Add to favorites
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ spaceId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to add favorite');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      setIsFavorited(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (isChecking) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(sizeClasses[size], "rounded-full", className)}
        disabled
      >
        <Heart className={`h-${iconSizes[size]} w-${iconSizes[size]} text-muted-foreground`} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        "rounded-full transition-all hover:scale-110",
        isFavorited && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "transition-all",
          isFavorited ? "fill-current scale-110" : "scale-100"
        )}
        size={iconSizes[size]}
      />
    </Button>
  );
}
