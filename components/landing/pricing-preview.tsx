import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPreview() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. Pay only for what you use.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* For Brands */}
          <div className="p-8 rounded-2xl bg-card border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">For Brands</h3>
              
              <div className="space-y-2">
                <p className="text-muted-foreground">Pay per booking</p>
                <div className="text-4xl font-bold">
                  Starting at{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ₹5,000
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">per month per space</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Instant booking confirmation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time campaign analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Verified venue quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">24/7 customer support</span>
                </div>
              </div>

              <Link href="/spaces" className="block">
                <Button className="w-full" size="lg">
                  Browse Spaces
                </Button>
              </Link>
            </div>
          </div>

          {/* For Venue Owners */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-medium">
                Popular
              </span>
            </div>

            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">For Venue Owners</h3>
              
              <div className="space-y-2">
                <p className="text-muted-foreground">List spaces for free</p>
                <div className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Earn 85%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">of booking fee</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Zero listing fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Control your pricing & availability</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Direct payments to your account</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Detailed earning reports</span>
                </div>
              </div>

              <Link href="/host/new" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-accent" size="lg">
                  List Your Venue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* No Hidden Fees Badge */}
        <div className="text-center mt-8">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
            <Check className="h-4 w-4" />
            No hidden fees • Transparent pricing
          </p>
        </div>
      </div>
    </section>
  );
}
