import { Target, Lightbulb, DollarSign, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "The Problem",
    description: "Offline advertising is fragmented. Brands struggle to find and book high-traffic ad placements with verified footfall data.",
  },
  {
    icon: Lightbulb,
    title: "Our Solution",
    description: "Unified marketplace connecting brands with venue owners. Instant booking, verified footfall metrics, transparent pricing.",
  },
  {
    icon: DollarSign,
    title: "Revenue Model",
    description: "10-15% commission per campaign + Premium venue subscriptions + Featured placement packages.",
  },
  {
    icon: TrendingUp,
    title: "Market Opportunity",
    description: "Hyperlocal advertising market growing 30% YoY. SMBs and D2C brands need measurable offline reach.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Advermo?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Solving real problems with a scalable, investor-ready business model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
