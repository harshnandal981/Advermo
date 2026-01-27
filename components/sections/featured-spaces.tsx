import Link from "next/link";
import { spaces } from "@/lib/data";
import SpaceCard from "@/components/ui/space-card";
import { Button } from "@/components/ui/button";

export default function FeaturedSpaces() {
  const featuredSpaces = spaces.filter((space) => space.featured).slice(0, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Spaces</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium spaces for your next project or event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/spaces">
            <Button size="lg" variant="outline">
              View All Spaces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
