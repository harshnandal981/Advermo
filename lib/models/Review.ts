import mongoose, { Schema, model, models } from 'mongoose';

export interface IReview {
  _id: string;
  spaceId: string;
  userId: string;
  userName: string;
  userRole: 'brand' | 'venue';
  rating: number; // 1-5
  comment?: string; // Optional, max 500 characters
  helpful: number; // Count of helpful votes
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    spaceId: {
      type: String,
      required: [true, 'Space ID is required'],
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userRole: {
      type: String,
      enum: ['brand', 'venue'],
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per space
ReviewSchema.index({ spaceId: 1, userId: 1 }, { unique: true });

// Index for efficient queries
ReviewSchema.index({ spaceId: 1, createdAt: -1 });
ReviewSchema.index({ spaceId: 1, rating: -1 });

const Review = models.Review || model<IReview>('Review', ReviewSchema);

export default Review;
