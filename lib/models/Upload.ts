import mongoose, { Schema, model, models } from 'mongoose';

export interface IUpload {
  userId: Schema.Types.ObjectId;
  resourceType: 'space' | 'profile' | 'proof' | 'review';
  resourceId?: Schema.Types.ObjectId;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  uploadedAt: Date;
}

const uploadSchema = new Schema<IUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['space', 'profile', 'proof', 'review'],
      required: [true, 'Resource type is required'],
      index: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    secureUrl: {
      type: String,
      required: [true, 'Secure URL is required'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
    },
    width: {
      type: Number,
      required: [true, 'Width is required'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
    },
    bytes: {
      type: Number,
      required: [true, 'File size is required'],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
uploadSchema.index({ userId: 1, uploadedAt: -1 });
uploadSchema.index({ resourceType: 1, resourceId: 1 });

const Upload = models.Upload || model<IUpload>('Upload', uploadSchema);

export default Upload;
