import { Map, ShieldCheck, CreditCard, BarChart3, Zap, Bell } from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Interactive Map Search",
    description: "Find spaces by location with our advanced map view",
  },
  {
    icon: ShieldCheck,
    title: "Verified Venues",
    description: "All venues are verified for authenticity and quality",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Razorpay integration for safe, hassle-free transactions",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track campaign performance with detailed insights",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book and confirm campaigns in minutes, not days",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay updated with email and in-app notifications",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Advermo?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make advertising simple and effective
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50"
              >
                {/* Icon */}
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
