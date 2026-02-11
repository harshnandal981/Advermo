import mongoose, { Schema, model, models } from 'mongoose';

export interface IFavorite {
  _id: string;
  userId: mongoose.Types.ObjectId;
  spaceId: string;
  addedAt: Date;
  notes?: string;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    spaceId: {
      type: String,
      required: [true, 'Space ID is required'],
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: { createdAt: 'addedAt', updatedAt: false },
  }
);

// Compound index for fast lookups and preventing duplicates
FavoriteSchema.index({ userId: 1, spaceId: 1 }, { unique: true });

// Index for sorting by date
FavoriteSchema.index({ addedAt: -1 });

const Favorite = models.Favorite || model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
