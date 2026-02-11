import mongoose, { Schema, model, models } from 'mongoose';

export interface IAdSpace {
  name: string;
  venueType: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  adSpaceType: 'poster' | 'screen' | 'table-tent' | 'counter' | 'menu' | 'outdoor';
  placement: string;
  dailyFootfall: number;
  monthlyImpressions: number;
  demographics: string;
  price: number;
  priceUnit: 'week' | 'month' | 'campaign';
  images: string[];
  description: string;
  peakHours: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  ownerId: Schema.Types.ObjectId;
  ownerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const adSpaceSchema = new Schema<IAdSpace>(
  {
    name: {
      type: String,
      required: [true, 'Space name is required'],
      trim: true,
    },
    venueType: {
      type: String,
      required: [true, 'Venue type is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(coords: number[]) {
            return coords.length === 2 && 
              coords[0] >= -180 && coords[0] <= 180 && // longitude
              coords[1] >= -90 && coords[1] <= 90; // latitude
          },
          message: 'Invalid coordinates',
        },
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    adSpaceType: {
      type: String,
      enum: ['poster', 'screen', 'table-tent', 'counter', 'menu', 'outdoor'],
      required: [true, 'Ad space type is required'],
    },
    placement: {
      type: String,
      required: [true, 'Placement description is required'],
    },
    dailyFootfall: {
      type: Number,
      required: [true, 'Daily footfall is required'],
      min: 0,
    },
    monthlyImpressions: {
      type: Number,
      required: [true, 'Monthly impressions is required'],
      min: 0,
    },
    demographics: {
      type: String,
      required: [true, 'Demographics information is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceUnit: {
      type: String,
      enum: ['week', 'month', 'campaign'],
      required: [true, 'Price unit is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    peakHours: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    ownerEmail: {
      type: String,
      required: [true, 'Owner email is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
adSpaceSchema.index({ location: '2dsphere' });

// Additional indexes for common queries
adSpaceSchema.index({ city: 1 });
adSpaceSchema.index({ venueType: 1 });
adSpaceSchema.index({ adSpaceType: 1 });
adSpaceSchema.index({ price: 1 });
adSpaceSchema.index({ rating: -1 });
adSpaceSchema.index({ featured: 1 });

const AdSpace = models.AdSpace || model<IAdSpace>('AdSpace', adSpaceSchema);

export default AdSpace;
