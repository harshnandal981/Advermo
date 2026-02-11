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
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'created';
export type PaymentStatusType = PaymentStatus; // Alias for backward compatibility

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

// Email-related types
export type EmailTemplate = 
  | 'welcome'
  | 'booking_created'
  | 'booking_received'
  | 'booking_confirmed'
  | 'booking_rejected'
  | 'payment_success'
  | 'payment_failed'
  | 'refund_processed'
  | 'campaign_starting_soon'
  | 'campaign_started'
  | 'campaign_completed'
  | 'booking_cancelled'
  | 'password_reset'
  | 'email_verification';

export interface EmailLog {
  _id: string;
  recipient: string;
  subject: string;
  template: EmailTemplate;
  status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened';
  resendId?: string;
  metadata: Record<string, any>;
  error?: string;
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
}

export interface EmailPreferences {
  bookingUpdates: boolean;
  paymentReceipts: boolean;
  campaignReminders: boolean;
  marketing: boolean;
}

// Location and Map-related types
export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SearchFilters {
  location?: {
    lat: number;
    lng: number;
    radius: number; // in meters
  };
  city?: string;
  priceRange?: { min: number; max: number };
  venueTypes?: string[];
  adFormats?: string[];
  footfallRange?: { min: number; max: number };
  minRating?: number;
  availability?: { startDate: Date; endDate: Date };
  sortBy?: 'distance' | 'price' | 'rating' | 'footfall';
}

// Razorpay payment types
export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Razorpay window extension
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Analytics types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  amount?: number;
  count?: number;
  rate?: number;
}

export interface RevenueMetrics {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  chartData: ChartDataPoint[];
}

export interface BookingMetrics {
  total: number;
  pending: number;
  confirmed: number;
  active: number;
  completed: number;
  cancelled: number;
  chartData: ChartDataPoint[];
}

export interface SpaceMetrics {
  total: number;
  averageRating: number;
  totalReviews: number;
  topPerforming: TopSpace[];
}

export interface OccupancyMetrics {
  rate: number;
  heatmapData: ChartDataPoint[];
}

export interface AdFormatMetrics {
  distribution: Array<{ format: string; count: number; revenue: number }>;
}

export interface GeneralMetrics {
  averageBookingValue: number;
  averageDuration: number;
  conversionRate: number;
  responseTime: number;
}

export interface TopSpace {
  space: AdSpace;
  revenue: number;
  bookingCount: number;
  occupancyRate: number;
  averageRating: number;
}

export interface VenueOwnerAnalytics {
  revenue: RevenueMetrics;
  bookings: BookingMetrics;
  spaces: SpaceMetrics;
  occupancy: OccupancyMetrics;
  adFormats: AdFormatMetrics;
  metrics: GeneralMetrics;
}

export interface CampaignMetrics {
  total: number;
  active: number;
  completed: number;
  totalSpent: number;
  chartData: ChartDataPoint[];
}

export interface SpendingMetrics {
  total: number;
  thisMonth: number;
  byVenueType: Array<{ type: string; amount: number }>;
  chartData: ChartDataPoint[];
}

export interface PerformanceMetrics {
  totalImpressions: number;
  averageCPM: number;
  topVenues: Array<{ space: AdSpace; spent: number; impressions: number }>;
}

export interface BrandAnalytics {
  campaigns: CampaignMetrics;
  spending: SpendingMetrics;
  performance: PerformanceMetrics;
}

export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'last90days' | 'thisYear' | 'custom';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  spaceId?: string;
}

export type ExportFormat = 'csv' | 'pdf';
export type ExportType = 'revenue' | 'bookings' | 'all';

// Image Upload Types
export interface ImageData {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  uploadedAt: Date;
  isPrimary?: boolean;
  order?: number;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder: 'spaces' | 'profiles' | 'proofs' | 'reviews';
  maxSize?: number;
  maxFiles?: number;
  allowedTypes?: string[];
}
