"use client";

import { Button } from "@/components/ui/button";
import { Search, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Find Perfect Ad Spaces
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                For Your Brand
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover & book premium advertising spaces in cafes, gyms, malls & more.
              Launch campaigns in minutes, not days.
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/spaces">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
            <Link href="/spaces">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Search className="h-5 w-5 mr-2" />
                Browse Spaces
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">500+ Venues</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Instant Booking</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Verified Spaces</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Easy Payments</span>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="pt-12 animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-card/50 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-6xl">🎯</div>
                  <p className="text-muted-foreground text-sm">Platform Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
