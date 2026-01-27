import { ArrowUpRight } from "lucide-react";

const metrics = [
  {
    value: "500+",
    label: "Active Listings",
    trend: "+45%",
    period: "vs last quarter",
  },
  {
    value: "50+",
    label: "Cities Covered",
    trend: "+30%",
    period: "expansion rate",
  },
  {
    value: "10,000+",
    label: "Total Bookings",
    trend: "+120%",
    period: "YoY growth",
  },
  {
    value: "₹2.5 Cr",
    label: "GMV Generated",
    trend: "+85%",
    period: "revenue growth",
  },
];

export default function Metrics() {
  return (
    <section className="py-20 bg-card border-y">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Traction & Metrics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real growth, real potential. Our numbers speak for themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {metric.value}
              </div>
              <div className="text-sm font-medium mb-3">{metric.label}</div>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-3 w-3" />
                <span className="font-semibold">{metric.trend}</span>
                <span className="text-muted-foreground ml-1">{metric.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
