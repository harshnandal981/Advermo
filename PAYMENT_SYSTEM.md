# Payment Integration System - Complete Documentation

This document provides comprehensive documentation for the Razorpay payment integration system in Advermo.

## Overview

A complete payment processing system integrated with Razorpay for handling booking payments, refunds, and payment verification.

## Features Implemented

### ✅ Payment Processing
- Create Razorpay payment orders
- Secure payment verification using HMAC SHA256
- Support for UPI, Cards, Net Banking, Wallets
- Real-time payment status updates

### ✅ Refund Management
- Automatic refund calculation based on cancellation policies
- Full refund: 7+ days before start date
- 50% refund: 3-6 days before start date
- No refund: Less than 3 days before start date

### ✅ Security Features
- Server-side payment signature verification
- Webhook signature validation
- Encrypted payment data storage
- PCI DSS compliance (via Razorpay)

### ✅ Auto-cancellation
- Automatic cancellation of unpaid bookings after 24 hours
- Vercel cron job for periodic cleanup
- Email notifications (ready for integration)

## Architecture

### Database Models

#### Payment Model
```typescript
{
  bookingId: ObjectId,
  brandId: String,
  amount: Number (in paise),
  currency: String ('INR'),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: Enum ('created', 'pending', 'success', 'failed', 'refunded'),
  method: String,
  receipt: String,
  notes: Object,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

#### Updated Booking Model
Added fields:
- `paymentId`: Reference to Payment
- `isPaid`: Boolean
- `paidAt`: Date

### API Endpoints

#### POST /api/payments/create-order
Creates a Razorpay order for a booking.
- **Auth**: Required (brands only)
- **Input**: `{ bookingId }`
- **Output**: Order details with Razorpay key
- **Security**: Validates booking ownership

#### POST /api/payments/verify
Verifies payment signature after successful payment.
- **Auth**: Required
- **Input**: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId }`
- **Output**: Payment and booking confirmation
- **Security**: HMAC SHA256 signature verification

#### POST /api/payments/webhook
Handles Razorpay webhook events.
- **Auth**: Webhook signature validation
- **Events**: payment.captured, payment.failed, refund.created
- **Security**: Signature verification with webhook secret

#### GET /api/payments/:bookingId
Retrieves payment details for a booking.
- **Auth**: Required (brand or venue owner)
- **Output**: Payment and booking information

#### POST /api/payments/refund
Initiates a refund for a paid booking.
- **Auth**: Required (brand only)
- **Input**: `{ bookingId, reason }`
- **Output**: Refund details
- **Validation**: Checks refund eligibility

#### GET /api/cron/cancel-unpaid
Auto-cancels unpaid bookings older than 24 hours.
- **Auth**: Optional cron secret
- **Schedule**: Every 6 hours (configurable in vercel.json)

### UI Components

#### PaymentButton
- Loads Razorpay SDK dynamically
- Creates payment order
- Opens Razorpay checkout
- Handles success/failure callbacks
- Shows loading states

#### PaymentStatus
- Displays payment status with icons
- Shows amount, method, transaction ID
- Color-coded status badges
- Receipt information

#### InvoiceCard
- Booking summary
- Payment breakdown (subtotal, commission, GST)
- Download invoice (PDF generation ready)
- Transaction details

#### RefundDialog
- Refund amount calculator
- Cancellation policy display
- Reason input field
- Confirmation workflow

### Pages

#### /bookings/[id]/payment
Payment checkout page for unpaid bookings.
- Booking summary
- Payment amount breakdown
- Razorpay payment button
- Security information

#### /payments/success
Success confirmation page after payment.
- Success animation
- Booking details
- Next steps guide
- Navigation links

#### /payments/failure
Error page for failed payments.
- Error details
- Troubleshooting tips
- Retry payment option
- Support contact

### Payment Flow

```
1. Brand creates booking → Status: pending, isPaid: false
2. Redirected to /bookings/[id]/payment
3. Click "Proceed to Payment"
4. API creates Razorpay order
5. Razorpay checkout modal opens
6. User completes payment
7. Payment verified on backend
8. Booking updated: isPaid=true, status=confirmed
9. Redirect to /payments/success
10. Webhook confirms payment (background)
```

### Refund Flow

```
1. Brand requests refund
2. System calculates refund amount based on policy
3. Refund created via Razorpay API
4. Payment status → 'refunded'
5. Booking paymentStatus → 'refunded'
6. Webhook confirms refund
7. Funds returned to brand
```

## Environment Variables

Add to `.env.local`:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

# Optional: Webhook Secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Optional: Cron Secret
CRON_SECRET=your_cron_secret
```

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at [https://razorpay.com/](https://razorpay.com/)
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys (for development)
4. Copy Key ID and Key Secret
5. Add to `.env.local`

### 2. Configure Webhooks

1. Go to Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - payment.captured
   - payment.failed
   - refund.created
4. Copy webhook secret
5. Add to `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

### 3. Test Payment Flow

Use Razorpay test cards:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

### 4. Production Setup

1. Complete KYC verification on Razorpay
2. Generate live API keys (start with `rzp_live_`)
3. Update environment variables with live keys
4. Test thoroughly before going live
5. Monitor webhook events

## Business Logic

### Commission Structure
- Platform commission: 15% of booking amount
- GST on commission: 18%
- Venue owner receives: 85% of booking amount
- Platform earns: 15% + 3.3% (GST) = 18.3% total

### Payment Policies
- Payment deadline: 24 hours after booking creation
- Auto-cancel unpaid bookings after deadline
- Refund eligibility: Only for paid bookings before start date

### Refund Policy
| Days Before Start | Refund Percentage |
|-------------------|-------------------|
| 7+ days           | 100%             |
| 3-6 days          | 50%              |
| < 3 days          | 0%               |

## Security Considerations

### Payment Verification
- Always verify payment signature server-side
- Never trust client-side payment status
- Use crypto.createHmac for signature validation
- Validate amount matches booking amount

### Webhook Security
- Verify webhook signatures
- Implement idempotency for duplicate webhooks
- Log all webhook events
- Handle failures gracefully

### Data Protection
- Never store card details
- Only store Razorpay transaction IDs
- Use HTTPS for all communications
- PCI DSS compliance via Razorpay

## Testing Checklist

- [ ] Create payment order
- [ ] Complete successful payment
- [ ] Handle failed payment
- [ ] Verify payment signature
- [ ] Test webhook events
- [ ] Initiate refund
- [ ] Process refund webhook
- [ ] Auto-cancel unpaid bookings
- [ ] Invoice generation
- [ ] Mobile responsive checkout
- [ ] Dark mode compatibility

## Troubleshooting

### Payment fails immediately
- Check Razorpay keys are correct
- Verify NEXT_PUBLIC_RAZORPAY_KEY_ID is set
- Check console for JavaScript errors

### Webhook not received
- Verify webhook URL is accessible
- Check webhook secret matches
- Look at Razorpay dashboard logs

### Signature verification fails
- Ensure RAZORPAY_KEY_SECRET is correct
- Check order ID and payment ID match
- Verify signature format

## Future Enhancements

- [ ] PDF invoice generation
- [ ] Email notifications
- [ ] Payment analytics dashboard
- [ ] Multi-currency support
- [ ] Subscription/recurring payments
- [ ] Split payments
- [ ] Payment links

## Support

For Razorpay API documentation:
- [https://razorpay.com/docs/](https://razorpay.com/docs/)

For issues:
- Check Razorpay dashboard logs
- Review server logs
- Contact Razorpay support if needed

## Dependencies

```json
{
  "razorpay": "^2.x.x",
  "@radix-ui/react-dialog": "^1.x.x",
  "@radix-ui/react-label": "^2.x.x",
  "@radix-ui/react-slot": "^1.x.x",
  "date-fns": "^4.x.x",
  "framer-motion": "^11.x.x"
}
```

## File Structure

```
├── app/
│   ├── api/
│   │   ├── payments/
│   │   │   ├── create-order/route.ts
│   │   │   ├── verify/route.ts
│   │   │   ├── webhook/route.ts
│   │   │   ├── refund/route.ts
│   │   │   └── [bookingId]/route.ts
│   │   └── cron/
│   │       └── cancel-unpaid/route.ts
│   ├── bookings/[id]/payment/page.tsx
│   └── payments/
│       ├── success/page.tsx
│       └── failure/page.tsx
├── components/
│   └── payments/
│       ├── payment-button.tsx
│       ├── payment-status.tsx
│       ├── invoice-card.tsx
│       └── refund-dialog.tsx
├── lib/
│   ├── models/
│   │   └── Payment.ts
│   ├── payments/
│   │   ├── verify.ts
│   │   └── refund.ts
│   └── razorpay.ts
└── types/index.ts
```
