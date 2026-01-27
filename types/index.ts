export type SpaceType = "workspace" | "event" | "studio" | "stay";

export interface Space {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  location: string;
  city: string;
  price: number;
  priceUnit: "hour" | "day" | "month";
  capacity: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  host: Host;
  availability: boolean;
  featured: boolean;
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
}

export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "guest" | "host";
}

export interface FilterOptions {
  priceRange: [number, number];
  spaceTypes: SpaceType[];
  capacity: number;
  amenities: string[];
}

export interface SortOption {
  label: string;
  value: "price-low" | "price-high" | "rating" | "popularity";
}
