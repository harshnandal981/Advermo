import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'brand' | 'venue';
  image?: string; // Legacy support
  profileImage?: {
    url: string;
    publicId: string;
  };
  emailVerified?: Date;
  phoneVerified?: Date;
  phone?: string;
  emailPreferences?: {
    bookingUpdates: boolean;
    paymentReceipts: boolean;
    campaignReminders: boolean;
    marketing: boolean;
  };
  favoritesCount?: number;
  // Verification & Trust fields
  isVerified?: boolean;
  verifiedAt?: Date;
  verificationType?: 'email' | 'phone' | 'identity' | 'business';
  verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  verificationDocuments?: {
    type: string;
    url: string;
    publicId: string;
    uploadedAt: Date;
  }[];
  trustScore?: number; // 0-100
  responseTime?: number; // Average hours to respond
  acceptanceRate?: number; // Percentage of bookings accepted
  totalBookingsHosted?: number;
  totalBookingsMade?: number;
  yearsInBusiness?: number;
  businessDetails?: {
    name?: string;
    registrationNumber?: string;
    gstNumber?: string;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['brand', 'venue'],
      default: 'brand',
      required: true,
    },
    image: {
      type: String,
    },
    profileImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
    emailVerified: {
      type: Date,
    },
    phoneVerified: {
      type: Date,
    },
    phone: {
      type: String,
      trim: true,
    },
    emailPreferences: {
      type: {
        bookingUpdates: { type: Boolean, default: true },
        paymentReceipts: { type: Boolean, default: true },
        campaignReminders: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      default: () => ({
        bookingUpdates: true,
        paymentReceipts: true,
        campaignReminders: true,
        marketing: false,
      }),
    },
    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Verification & Trust fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verificationType: {
      type: String,
      enum: ['email', 'phone', 'identity', 'business'],
    },
    verificationStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },
    verificationDocuments: [{
      type: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    responseTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalBookingsHosted: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBookingsMade: {
      type: Number,
      default: 0,
      min: 0,
    },
    yearsInBusiness: {
      type: Number,
      default: 0,
      min: 0,
    },
    businessDetails: {
      name: String,
      registrationNumber: String,
      gstNumber: String,
      address: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

const User = models.User || model<IUser>('User', UserSchema);

export default User;
