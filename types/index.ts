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

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  _id: string;
  spaceId: string;
  spaceName: string;
  brandId: string;
  brandName: string;
  brandEmail: string;
  venueOwnerId: string;
  venueOwnerEmail: string;
  startDate: Date | string;
  endDate: Date | string;
  duration: number;
  campaignObjective: string;
  targetAudience: string;
  budget?: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  isPaid: boolean;
  paidAt?: Date | string;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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

// Payment Types
export type PaymentStatusType = 'created' | 'pending' | 'success' | 'failed' | 'refunded';

export interface Payment {
  _id: string;
  bookingId: string;
  brandId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatusType;
  method?: string;
  receipt: string;
  notes?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

// Extend global Window interface for Razorpay
interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
