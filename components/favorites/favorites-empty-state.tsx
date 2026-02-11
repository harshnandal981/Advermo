"use client";

import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoritesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl" />
        <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-full p-8">
          <Heart className="h-16 w-16 text-muted-foreground" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-md">
        Start building your wishlist by clicking the heart icon on any ad space you like.
        Save your favorites to compare them later!
      </p>

      <Link href="/spaces">
        <Button size="lg" className="gap-2">
          <Sparkles className="h-5 w-5" />
          Explore Ad Spaces
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">Save Favorites</h3>
          <p className="text-sm text-muted-foreground">
            Click the heart icon to save spaces you love
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">Compare Spaces</h3>
          <p className="text-sm text-muted-foreground">
            Select up to 3 favorites to compare side-by-side
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">Share Wishlist</h3>
          <p className="text-sm text-muted-foreground">
            Share your collection with team members
          </p>
        </div>
      </div>
    </div>
  );
}
