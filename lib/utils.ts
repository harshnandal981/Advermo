import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceUnit(unit: string): string {
  const units: Record<string, string> = {
    hour: "/hr",
    day: "/day",
    month: "/mo",
  };
  return units[unit] || `/${unit}`;
}
