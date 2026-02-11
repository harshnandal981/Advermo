"use client";

const brandLogos = [
  { id: "1", name: "TechStart", logo: "🚀" },
  { id: "2", name: "FitLife", logo: "💪" },
  { id: "3", name: "Brew & Beans", logo: "☕" },
  { id: "4", name: "LocalBiz", logo: "🏪" },
  { id: "5", name: "PowerHouse", logo: "⚡" },
  { id: "6", name: "HealthPlus", logo: "❤️" },
  { id: "7", name: "EduTech", logo: "📚" },
  { id: "8", name: "FoodHub", logo: "🍕" },
  { id: "9", name: "StyleCo", logo: "👔" },
  { id: "10", name: "GreenEarth", logo: "🌱" },
];

export default function BrandLogos() {
  return (
    <section className="py-20 bg-background border-y overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Trusted By Leading Brands</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of successful brands advertising with Advermo
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {brandLogos.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center justify-center p-6 rounded-lg bg-card border hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                {brand.logo}
              </div>
              <p className="text-xs text-muted-foreground font-medium">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
