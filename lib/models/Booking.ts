import mongoose, { Schema, model, models } from 'mongoose';

export interface IBooking {
  _id: string;
  spaceId: string;
  spaceName: string;
  brandId: string;
  brandName: string;
  brandEmail: string;
  venueOwnerId: string;
  venueOwnerEmail: string;
  startDate: Date;
  endDate: Date;
  duration: number; // days
  campaignObjective: string;
  targetAudience: string;
  budget?: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    spaceId: {
      type: String,
      required: [true, 'Space ID is required'],
      index: true,
    },
    spaceName: {
      type: String,
      required: [true, 'Space name is required'],
    },
    brandId: {
      type: String,
      required: [true, 'Brand ID is required'],
      index: true,
    },
    brandName: {
      type: String,
      required: [true, 'Brand name is required'],
    },
    brandEmail: {
      type: String,
      required: [true, 'Brand email is required'],
    },
    venueOwnerId: {
      type: String,
      required: [true, 'Venue owner ID is required'],
      index: true,
    },
    venueOwnerEmail: {
      type: String,
      required: [true, 'Venue owner email is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [7, 'Minimum campaign duration is 7 days'],
      max: [365, 'Maximum campaign duration is 365 days'],
    },
    campaignObjective: {
      type: String,
      required: [true, 'Campaign objective is required'],
      enum: [
        'Brand Awareness',
        'Lead Generation',
        'Sales',
        'Product Launch',
        'Event Promotion',
        'App Downloads',
        'Other',
      ],
    },
    targetAudience: {
      type: String,
      required: [true, 'Target audience is required'],
      minlength: [10, 'Target audience must be at least 10 characters'],
    },
    budget: {
      type: Number,
      min: [0, 'Budget must be positive'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
BookingSchema.index({ brandId: 1, status: 1 });
BookingSchema.index({ venueOwnerId: 1, status: 1 });
BookingSchema.index({ spaceId: 1, startDate: 1, endDate: 1 });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
