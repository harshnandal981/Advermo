"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";

const steps = ["Space Details", "Pricing", "Photos", "Availability", "Review"];

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
          <h1 className="text-3xl font-bold mb-2">List Your Space</h1>
          <p className="text-muted-foreground">Get your space listed in just a few steps</p>
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
            {/* Step 0: Space Details */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Tell us about your space</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Space Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Modern Creative Studio"
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Space Type</label>
                  <select className="w-full px-4 py-3 border rounded-lg bg-background">
                    <option>Select type...</option>
                    <option>Workspace</option>
                    <option>Event Hall</option>
                    <option>Studio</option>
                    <option>Co-Living Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your space, its features, and what makes it special..."
                    className="w-full px-4 py-3 border rounded-lg bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Bandra West, Mumbai"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      placeholder="Number of people"
                      className="w-full px-4 py-3 border rounded-lg bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Pricing */}
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
                      <option>Hour</option>
                      <option>Day</option>
                      <option>Month</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-sm font-medium mb-2">Estimated earnings</div>
                  <div className="text-2xl font-bold text-primary">₹25,000 - ₹50,000/month</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on similar spaces in your area
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amenities (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Wi-Fi", "AC", "Parking", "Kitchen", "Projector", "Sound System"].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Add photos</h2>
                <p className="text-muted-foreground">Upload at least 3 high-quality photos of your space</p>
                
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
                    <div className="text-sm text-muted-foreground mb-1">Space Name</div>
                    <div className="font-medium">Modern Creative Studio</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Type & Location</div>
                    <div className="font-medium">Studio • Bandra West, Mumbai</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background border">
                    <div className="text-sm text-muted-foreground mb-1">Pricing</div>
                    <div className="font-medium">₹2,500 per hour</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                        Your listing is ready!
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Once submitted, your space will be reviewed and go live within 24 hours.
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
                  Submit Listing
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
