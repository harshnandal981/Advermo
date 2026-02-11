import mongoose, { Schema, model, models } from 'mongoose';
import { EmailTemplate } from '@/types';

export interface IEmailLog {
  _id: string;
  recipient: string;
  subject: string;
  template: EmailTemplate;
  status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened';
  resendId?: string;
  metadata: Record<string, any>;
  error?: string;
  sentAt: Date;
  deliveredAt?: Date;
  openedAt?: Date;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    recipient: {
      type: String,
      required: [true, 'Recipient email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
    },
    template: {
      type: String,
      required: [true, 'Email template is required'],
      enum: [
        'welcome',
        'booking_created',
        'booking_received',
        'booking_confirmed',
        'booking_rejected',
        'payment_success',
        'payment_failed',
        'refund_processed',
        'campaign_starting_soon',
        'campaign_started',
        'campaign_completed',
        'booking_cancelled',
        'password_reset',
        'email_verification',
      ],
      index: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'bounced', 'delivered', 'opened'],
      default: 'sent',
      index: true,
    },
    resendId: {
      type: String,
      sparse: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    error: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deliveredAt: {
      type: Date,
    },
    openedAt: {
      type: Date,
    },
  },
  {
    timestamps: false, // We're managing timestamps manually
  }
);

// Compound indexes for common queries
EmailLogSchema.index({ recipient: 1, template: 1 });
EmailLogSchema.index({ status: 1, sentAt: -1 });
EmailLogSchema.index({ template: 1, sentAt: -1 });

const EmailLog = models.EmailLog || model<IEmailLog>('EmailLog', EmailLogSchema);

export default EmailLog;
