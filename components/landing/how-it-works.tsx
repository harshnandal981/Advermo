"use client";

import { useState } from "react";
import { Search, Calendar, CheckCircle, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const brandsSteps = [
  {
    step: 1,
    icon: Search,
    title: "Discover",
    description: "Browse verified ad spaces across premium venues",
  },
  {
    step: 2,
    icon: Calendar,
    title: "Book",
    description: "Select dates and confirm booking in minutes",
  },
  {
    step: 3,
    icon: CheckCircle,
    title: "Launch",
    description: "Your campaign goes live at your chosen venues",
  },
];

const venueSteps = [
  {
    step: 1,
    icon: MapPin,
    title: "List",
    description: "Add your venue and available ad spaces",
  },
  {
    step: 2,
    icon: DollarSign,
    title: "Earn",
    description: "Receive and approve booking requests",
  },
  {
    step: 3,
    icon: TrendingUp,
    title: "Grow",
    description: "Build a passive income stream effortlessly",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"brands" | "venues">("brands");
  const steps = activeTab === "brands" ? brandsSteps : venueSteps;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How Advermo Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and effective for both brands and venue owners
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border bg-card p-1">
            <Button
              variant={activeTab === "brands" ? "default" : "ghost"}
              onClick={() => setActiveTab("brands")}
              className="rounded-md"
            >
              For Brands
            </Button>
            <Button
              variant={activeTab === "venues" ? "default" : "ghost"}
              onClick={() => setActiveTab("venues")}
              className="rounded-md"
            >
              For Venue Owners
            </Button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <div className="text-center space-y-4 p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold">{step.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow Connector (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
