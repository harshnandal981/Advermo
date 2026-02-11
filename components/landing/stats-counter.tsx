"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 500,
    label: "Venues Listed",
    suffix: "+",
  },
  {
    value: 50,
    label: "Cities Covered",
    suffix: "+",
  },
  {
    value: 10000,
    label: "Campaigns Launched",
    suffix: "+",
  },
  {
    value: 4.8,
    label: "Average Rating",
    suffix: "",
    decimals: 1,
  },
];

function useCountUp(target: number, duration: number = 2000, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = startValue + (target - startValue) * easeOut;

      setCount(Number(currentCount.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, decimals, hasAnimated]);

  return { count, setHasAnimated };
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-primary via-purple-600 to-accent text-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Trusted by Brands & Venues</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Join thousands of successful advertisers and venue partners
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  isVisible,
}: {
  stat: typeof stats[0];
  isVisible: boolean;
}) {
  const { count, setHasAnimated } = useCountUp(
    stat.value,
    2000,
    stat.decimals || 0
  );

  useEffect(() => {
    if (isVisible) {
      setHasAnimated(true);
    }
  }, [isVisible, setHasAnimated]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {count}
        {stat.suffix}
      </div>
      <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
    </div>
  );
}
