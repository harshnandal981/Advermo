export type AdSpaceType = 'poster' | 'screen' | 'table-tent' | 'counter' | 'menu' | 'outdoor';

export interface AdSpace {
  id: string;
  name: string; // e.g., "CCD Coffee - Koramangala"
  venueType: string; // "Café", "Gym", "Mall", "College", "Transit"
  location: string;
  type: AdSpaceType;
  placement: string; // "Wall Poster", "Digital Screen 43\"", "Table Tent"
  dailyFootfall: number; // e.g., 2500
  monthlyImpressions: number; // calculated from footfall
  demographics: string; // "Young professionals, students"
  price: number;
  priceUnit: 'week' | 'month' | 'campaign';
  images: string[];
  description: string;
  peakHours: string; // "8 AM - 12 PM, 6 PM - 9 PM"
  rating: number;
  reviewCount: number;
  averageRating?: number; // Average rating from reviews
  featured: boolean;
  verified: boolean;
}

// Keep Space as alias for backward compatibility during transition
export type Space = AdSpace;
export type SpaceType = AdSpaceType;

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
  adSpaceTypes: AdSpaceType[];
  venueTypes: string[];
  footfallRange: [number, number];
}

export interface SortOption {
  label: string;
  value: "price-low" | "price-high" | "rating" | "popularity" | "footfall" | "cpm";
}

export interface Review {
  _id: string;
  spaceId: string;
  userId: string;
  userName: string;
  userRole: 'brand' | 'venue';
  rating: number; // 1-5
  comment?: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
