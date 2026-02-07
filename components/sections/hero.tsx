"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const spaceTypes = ["Cafés", "Gyms", "Malls", "Colleges", "Transit", "Restaurants"];

export default function Hero() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover High-Traffic
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              Ad Spaces Instantly
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Rent ad placements in premium venues across cities. Reach your audience where they spend time.
          </p>

          {/* Space Type Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {spaceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type === selectedType ? null : type)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-card rounded-2xl shadow-xl border">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-background rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter city or venue type..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
              </div>
              <Button size="lg" className="md:px-8">
                <Search className="h-5 w-5 mr-2" />
                Search Ad Spaces
              </Button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="outline">
              Explore Ad Spaces
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              List Your Venue
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground mt-1">Ad Spots</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Venue Partners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-500">5M+</div>
              <div className="text-sm text-muted-foreground mt-1">Monthly Impressions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
