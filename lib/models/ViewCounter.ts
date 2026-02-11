import mongoose, { Schema, model, models } from 'mongoose';

export interface IViewCounter {
  _id: string;
  spaceId: Schema.Types.ObjectId;
  sessionId: string;
  lastSeenAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ViewCounterSchema = new Schema<IViewCounter>(
  {
    spaceId: {
      type: Schema.Types.ObjectId,
      ref: 'AdSpace',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookups
ViewCounterSchema.index({ spaceId: 1, sessionId: 1 }, { unique: true });

// TTL index to auto-delete expired view counters
ViewCounterSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ViewCounter = models.ViewCounter || model<IViewCounter>('ViewCounter', ViewCounterSchema);

export default ViewCounter;
