"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: "1",
    quote: "We booked 10 ad spaces across Bangalore through Advermo. The process was seamless and our campaign reached over 50,000 people!",
    author: "Rajesh Kumar",
    role: "Marketing Manager",
    company: "TechStart India",
    rating: 5,
  },
  {
    id: "2",
    quote: "Listing my cafe on Advermo has generated an additional ₹30,000/month in passive income. Highly recommend!",
    author: "Priya Sharma",
    role: "Cafe Owner",
    company: "Brew & Beans",
    rating: 5,
  },
  {
    id: "3",
    quote: "The map view made it so easy to find spaces in our target neighborhoods. Booked and launched in just 2 days!",
    author: "Michael D'Souza",
    role: "Growth Lead",
    company: "FitLife App",
    rating: 5,
  },
  {
    id: "4",
    quote: "Best platform for local advertising. Real-time analytics helped us optimize our campaigns and increase ROI by 3x.",
    author: "Sneha Patel",
    role: "Marketing Director",
    company: "LocalBiz Solutions",
    rating: 5,
  },
  {
    id: "5",
    quote: "As a gym owner, Advermo connects me with relevant fitness brands. The booking process is smooth and payments are always on time.",
    author: "Arjun Reddy",
    role: "Gym Owner",
    company: "PowerHouse Fitness",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-card border-y">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real success stories from brands and venue owners
          </p>
        </div>

        {/* Testimonial Card */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-lg border relative">
            {/* Quote */}
            <div className="text-center space-y-6">
              <div className="text-6xl text-primary/20">&ldquo;</div>
              <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
                {currentTestimonial.quote}
              </p>

              {/* Rating */}
              <div className="flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < currentTestimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="space-y-1">
                <p className="font-semibold text-lg">{currentTestimonial.author}</p>
                <p className="text-muted-foreground">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="pointer-events-auto rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="pointer-events-auto rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
