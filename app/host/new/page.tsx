"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";

const steps = ["Ad Spot Details", "Pricing & Metrics", "Photos", "Availability", "Review"];

export default function NewListingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">List Your Ad Spot</h1>
          <p className="text-muted-foreground">Monetize your venue by listing advertising space</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index < currentStep
                        ? "bg-primary text-white"
                        : index === currentStep
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="text-xs mt-2 text-center hidden md:block">{step}</div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${
                      index < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border">
            {/* Step 0: Ad Spot Details */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Tell us about your ad spot</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Ad Spot Name</label>
                  <input
                    type="text"
                    placeholder="e.g., CCD Coffee - Koramangala"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad Format</label>
                    <select className="w-full px-4 py-3 border rounded-lg bg-background">
                      <option>Select format...</option>
                      <option>Poster Wall</option>
                      <option>Digital Screen</option>
                      <option>Table Tent</option>
                      <option>Counter Branding</option>
                      <option>Menu Placement</option>
                      <option>Outdoor Billboard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Venue Type</label>
                    <select className="w-full px-4 py-3 border rounded-lg bg-background">
                      <option>Select venue...</option>
                      <option>Café</option>
                      <option>Gym</option>
                      <option>Mall</option>
                      <option>College</option>
                      <option>Transit</option>
                      <option>Restaurant</option>
                      <option>Co-working</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your ad spot, its visibility, and why it's valuable for advertisers..."
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location/Address</label>
                  <input
                    type="text"
                    placeholder="e.g., Koramangala 5th Block, Bangalore"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Daily Footfall</label>
                    <input
                      type="number"
                      placeholder="e.g., 2500"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Average visitors per day</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Impressions</label>
                    <input
                      type="number"
                      placeholder="e.g., 75000"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Estimated monthly views</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Demographics</label>
                  <input
                    type="text"
                    placeholder="e.g., Young professionals, students, age 20-35"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Describe your typical audience</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Peak Hours</label>
                  <input
                    type="text"
                    placeholder="e.g., 8 AM - 12 PM, 6 PM - 9 PM"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                  <p className="text-xs text-muted-foreground mt-1">When does your venue see the most traffic?</p>
                </div>
              </div>
            )}

            {/* Step 1: Pricing & Metrics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Set your pricing</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Per</label>
                    <select className="w-full px-4 py-3 border rounded-lg bg-background">
                      <option>Week</option>
                      <option>Month</option>
                      <option>Campaign</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-sm font-medium mb-2">Estimated earnings</div>
                  <div className="text-2xl font-bold text-primary">₹15,000 - ₹35,000/month</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on similar ad spots in your area
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background border">
                  <div className="text-sm font-medium mb-3">Cost Per Impression (CPM)</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Your CPM</div>
                      <div className="text-lg font-semibold">₹2.50</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Market Average</div>
                      <div className="text-lg font-semibold">₹3.00</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Calculated based on your pricing and monthly impressions
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Add photos</h2>
                <p className="text-muted-foreground">Upload at least 3 high-quality photos of your ad spot and venue</p>
                
                <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="text-sm font-medium mb-1">Click to upload or drag and drop</div>
                  <div className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted" />
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Set availability</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Available Days</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Opening Time</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Closing Time</label>
                    <input
                      type="time"
                      defaultValue="18:00"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Review and submit</h2>
                <p className="text-muted-foreground">
                  Please review your listing details before submitting
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Ad Spot Name</div>
                    <div className="font-medium">CCD Coffee - Koramangala</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Format & Venue</div>
                    <div className="font-medium">Poster Wall • Café • Koramangala, Bangalore</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Metrics</div>
                    <div className="font-medium">2,500 daily footfall • 75,000 monthly impressions</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Pricing</div>
                    <div className="font-medium">₹12,000 per month</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Your ad spot listing is ready!
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Once submitted, your ad spot will be reviewed and go live within 24 hours.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button size="lg">
                  List Ad Spot
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
