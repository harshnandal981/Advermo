import mongoose, { Schema, model, models } from 'mongoose';

export interface IActivity {
  _id: string;
  type: 'booking_created' | 'space_viewed' | 'review_posted' | 'verification_completed';
  userId: Schema.Types.ObjectId;
  userName: string; // Anonymized format: "John S."
  resourceId: Schema.Types.ObjectId;
  resourceName: string;
  timestamp: Date;
  isPublic: boolean;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ['booking_created', 'space_viewed', 'review_posted', 'verification_completed'],
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    resourceName: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    city: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
ActivitySchema.index({ timestamp: -1 });
ActivitySchema.index({ city: 1, timestamp: -1 });
ActivitySchema.index({ type: 1, timestamp: -1 });
ActivitySchema.index({ isPublic: 1, timestamp: -1 });

// TTL index to auto-delete activities older than 30 days
ActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const Activity = models.Activity || model<IActivity>('Activity', ActivitySchema);

export default Activity;
