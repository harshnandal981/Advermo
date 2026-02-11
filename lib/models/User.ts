import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'brand' | 'venue';
  image?: string;
  emailVerified?: Date;
  emailPreferences?: {
    bookingUpdates: boolean;
    paymentReceipts: boolean;
    campaignReminders: boolean;
    marketing: boolean;
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
    emailVerified: {
      type: Date,
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
  },
  {
    timestamps: true,
  }
);

// Index for faster email lookups
UserSchema.index({ email: 1 });

const User = models.User || model<IUser>('User', UserSchema);

export default User;
