# Email Notification System

A comprehensive transactional email system for Advermo using **Resend** and **React Email**.

## 🎯 Features

### 📧 14 Email Templates
- **Welcome** - New user onboarding
- **Booking Created** - Brand booking confirmation
- **Booking Received** - Venue owner notification
- **Booking Confirmed** - Brand approval notification
- **Booking Rejected** - Brand rejection notification
- **Booking Cancelled** - Cancellation confirmation
- **Payment Success** - Payment receipt with invoice
- **Payment Failed** - Payment retry reminder
- **Refund Processed** - Refund confirmation
- **Campaign Starting Soon** - 24h reminder
- **Campaign Started** - Campaign go-live notification
- **Campaign Completed** - Review request
- **Password Reset** - Secure password reset
- **Email Verification** - Account verification

### 🔧 Core Components

```
emails/
├── components/           # Reusable components
│   ├── EmailLayout.tsx  # Base layout
│   ├── Button.tsx       # CTA buttons
│   ├── BookingDetails.tsx
│   ├── Section.tsx
│   └── Divider.tsx
└── [template-name].tsx  # Email templates
```

### 📊 Email Service Layer

```
lib/email/
├── service.ts           # Resend integration
└── helpers.ts           # Utilities
```

- Email sending with retry logic
- Email logging to MongoDB
- User preference management
- Format helpers (currency, dates)

### 🔗 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/email/preferences` | GET, PUT | Manage email preferences |
| `/api/email/logs` | GET | View email history |
| `/api/email/test` | POST, GET | Test emails (dev only) |

### ⏰ Automated Cron Jobs

- **Campaign Reminders** (9 AM daily)
  - Send "starting soon" emails
  - Activate campaigns
  - Complete campaigns
  - Request reviews

- **Payment Reminders** (10 AM, 6 PM daily)
  - Remind users to complete payment
  - Auto-cancel unpaid bookings

## 🚀 Quick Start

### 1. Get Resend API Key

```bash
# Sign up at resend.com
# Create API key in dashboard
# Copy key (starts with re_)
```

### 2. Configure Environment

```env
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
EMAIL_FROM=Advermo <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Advermo
```

### 3. Test Email System

```bash
# Start dev server
npm run dev

# Send test email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","template":"welcome"}'
```

## 📖 Documentation

See [docs/email-setup.md](docs/email-setup.md) for:
- Detailed setup instructions
- Custom domain configuration
- Template development guide
- Troubleshooting tips

## 🔐 Security Features

- ✅ Email address validation
- ✅ User preference respect
- ✅ Graceful error handling
- ✅ Email logging for audit
- ✅ Unsubscribe management
- ✅ Rate limiting considerations

## 📈 Email Analytics

Track email performance:
- Sent/Failed/Delivered count
- Open rates (via Resend webhooks)
- Click rates
- Bounce rates

## 🎨 Email Design

- Mobile-responsive (600px max width)
- Modern, professional styling
- Consistent branding
- Clear call-to-actions
- Web-safe fonts

## 🧪 Testing

### Development
```bash
# List available templates
curl http://localhost:3000/api/email/test

# Send specific template
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","template":"booking_created"}'
```

### Production
- Verify domain in Resend
- Update `EMAIL_FROM` to verified domain
- Monitor deliverability in Resend dashboard

## 📝 Usage Example

```typescript
import { sendEmail } from '@/lib/email/service';
import WelcomeEmail from '@/emails/welcome';

// Send welcome email
await sendEmail({
  to: user.email,
  subject: 'Welcome to Advermo! 🎉',
  react: WelcomeEmail({ user }),
  template: 'welcome',
  metadata: { userId: user.id },
});
```

## 🔄 Email Triggers

Emails are automatically sent when:
- ✉️ User signs up → Welcome email
- ✉️ Booking created → Brand + Venue emails
- ✉️ Booking confirmed → Brand email
- ✉️ Booking rejected → Brand email
- ✉️ Payment success → Receipt email
- ✉️ Payment failed → Retry email
- ✉️ Campaign milestone → Reminder emails

## 🛠️ Tech Stack

- **Resend** - Email delivery (100 emails/day free)
- **React Email** - Email templates
- **MongoDB** - Email logging
- **Next.js API Routes** - Email endpoints
- **Vercel Cron** - Scheduled emails

## 📊 Database Schema

### EmailLog Model
```typescript
{
  recipient: string,
  subject: string,
  template: EmailTemplate,
  status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened',
  resendId?: string,
  metadata: Record<string, any>,
  error?: string,
  sentAt: Date,
  deliveredAt?: Date,
  openedAt?: Date
}
```

### User Model (Extended)
```typescript
{
  emailPreferences: {
    bookingUpdates: boolean,
    paymentReceipts: boolean,
    campaignReminders: boolean,
    marketing: boolean
  }
}
```

## 🚨 Error Handling

- Emails failures don't block user actions
- Failed emails logged to database
- Retry logic with exponential backoff
- Graceful degradation

## 📦 Dependencies

```json
{
  "resend": "^3.x",
  "react-email": "^2.x",
  "@react-email/components": "^0.x",
  "@react-email/render": "^0.x"
}
```

## 🔗 Resources

- [Resend Dashboard](https://resend.com/overview)
- [React Email Docs](https://react.email)
- [Email Setup Guide](docs/email-setup.md)

## ✨ Future Enhancements

- [ ] Email digest (weekly summary)
- [ ] In-app notifications
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Email A/B testing
- [ ] Advanced analytics

---

**Note**: For production use, verify your domain in Resend and update `EMAIL_FROM` to your verified domain (e.g., `noreply@advermo.com`).
