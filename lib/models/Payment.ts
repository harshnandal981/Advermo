import mongoose, { Schema, model, models } from 'mongoose';

export interface IPayment {
  _id: string;
  bookingId: mongoose.Types.ObjectId;
  brandId: string;
  amount: number; // in paise (smallest currency unit)
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'created' | 'pending' | 'success' | 'failed' | 'refunded';
  method?: string; // UPI, card, netbanking, etc.
  receipt: string; // unique receipt ID
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
      index: true,
    },
    brandId: {
      type: String,
      required: [true, 'Brand ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ['created', 'pending', 'success', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    method: {
      type: String,
    },
    receipt: {
      type: String,
      required: [true, 'Receipt is required'],
      unique: true,
      index: true,
    },
    notes: {
      type: Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
PaymentSchema.index({ bookingId: 1, status: 1 });
PaymentSchema.index({ brandId: 1, status: 1 });
PaymentSchema.index({ razorpayOrderId: 1, razorpayPaymentId: 1 });

const Payment = models.Payment || model<IPayment>('Payment', PaymentSchema);

export default Payment;
