import Link from "next/link";
import { adSpaces } from "@/lib/data";
import SpaceCard from "@/components/ui/space-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedSpaces() {
  const featuredSpaces = adSpaces.filter((space) => space.featured && space.verified).slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Ad Spaces</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium high-traffic placements verified for maximum brand exposure
          </p>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/spaces">
            <Button size="lg" variant="outline" className="group">
              View All Spaces
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
