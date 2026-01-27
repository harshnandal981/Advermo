import { Target, Lightbulb, DollarSign, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "The Problem",
    description: "Finding and booking quality spaces is fragmented, time-consuming, and lacks transparency in pricing and availability.",
  },
  {
    icon: Lightbulb,
    title: "Our Solution",
    description: "A unified platform connecting space seekers with verified hosts. Instant booking, transparent pricing, and seamless experience.",
  },
  {
    icon: DollarSign,
    title: "Revenue Model",
    description: "Commission-based (10-15% per booking) + Premium host subscriptions + Featured listing packages.",
  },
  {
    icon: TrendingUp,
    title: "Market Opportunity",
    description: "$50B+ global flexible space market. Growing demand for remote work, events, and creative spaces.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why SpaceHub?</h2>
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
