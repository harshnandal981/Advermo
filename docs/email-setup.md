# Email System Setup Guide

## Overview

Advermo uses **Resend** for email delivery and **React Email** for creating beautiful, responsive email templates. This guide will help you set up and configure the email system.

## Table of Contents

1. [Getting a Resend API Key](#getting-a-resend-api-key)
2. [Environment Configuration](#environment-configuration)
3. [Email Templates](#email-templates)
4. [Testing Emails Locally](#testing-emails-locally)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## Getting a Resend API Key

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" and create an account
3. Verify your email address

### Step 2: Create an API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Advermo Development" or "Advermo Production")
5. Choose permissions:
   - For development: **Full Access**
   - For production: **Sending Access** (recommended)
6. Click **Create**
7. **Copy the API key immediately** (it won't be shown again)

### Free Tier Limits

Resend's free tier includes:
- **100 emails/day**
- **3,000 emails/month**
- Perfect for development and testing

For production, consider upgrading to a paid plan.

---

## Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Add Email Configuration

Open `.env.local` and add:

```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# Email Sender (use test email for development)
EMAIL_FROM=Advermo <onboarding@resend.dev>
EMAIL_FROM_NAME=Advermo

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Advermo
```

**Important Notes:**
- For **development**: Use `onboarding@resend.dev` (Resend's test email)
- For **production**: Use your verified domain (e.g., `noreply@advermo.com`)
- Never commit `.env.local` to Git (it's in `.gitignore`)

### 3. Verify Configuration

Test your setup:

```bash
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","template":"welcome"}'
```

---

## Email Templates

### Available Templates

| Template | Trigger | Recipients |
|----------|---------|------------|
| `welcome` | User signup | New user |
| `booking_created` | Booking created | Brand |
| `booking_received` | Booking created | Venue owner |
| `booking_confirmed` | Booking approved | Brand |
| `booking_rejected` | Booking rejected | Brand |
| `payment_success` | Payment completed | Brand |
| `payment_failed` | Payment failed | Brand |
| `refund_processed` | Refund issued | Brand |
| `campaign_starting_soon` | 24h before start | Both |
| `campaign_started` | Campaign goes live | Both |
| `campaign_completed` | Campaign ends | Both |
| `booking_cancelled` | Booking cancelled | Both |
| `password_reset` | Password reset requested | User |
| `email_verification` | Email verification needed | User |

### Template Structure

All templates are located in `/emails/`:

```
emails/
├── components/          # Reusable components
│   ├── EmailLayout.tsx  # Base layout with header/footer
│   ├── Button.tsx       # CTA button
│   ├── BookingDetails.tsx # Booking info display
│   └── ...
├── welcome.tsx
├── booking-created.tsx
└── ...
```

### Creating a New Template

1. Create a new file in `/emails/`:

```tsx
// emails/my-template.tsx
import { Text } from '@react-email/components';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';

interface MyTemplateProps {
  user: {
    name: string;
  };
}

export const MyTemplate = ({ user }: MyTemplateProps) => {
  return (
    <EmailLayout preview="Preview text">
      <Text style={heading}>Hello {user.name}!</Text>
      <Button href="https://advermo.com">
        Click Here
      </Button>
    </EmailLayout>
  );
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#32325d',
};

export default MyTemplate;
```

2. Add to TypeScript types (`types/index.ts`):

```typescript
export type EmailTemplate = 
  | 'welcome'
  | 'my_template'  // Add your template
  | ...
```

3. Use in your code:

```typescript
import { sendEmail } from '@/lib/email/service';
import MyTemplate from '@/emails/my-template';

await sendEmail({
  to: 'user@example.com',
  subject: 'My Subject',
  react: MyTemplate({ user: { name: 'John' } }),
  template: 'my_template',
});
```

---

## Testing Emails Locally

### Method 1: Development Server

1. Start the dev server:

```bash
npm run dev
```

2. Use the test API endpoint:

```bash
# Send a test welcome email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "template": "welcome"
  }'
```

3. Check your inbox!

### Method 2: List Available Templates

```bash
curl http://localhost:3000/api/email/test
```

Returns:

```json
{
  "templates": [
    "welcome",
    "booking_created",
    ...
  ],
  "usage": {
    "method": "POST",
    "endpoint": "/api/email/test",
    "body": {
      "to": "recipient@example.com",
      "template": "welcome"
    }
  }
}
```

### Method 3: Preview Templates (Coming Soon)

We plan to add a React Email development server:

```bash
npm run email:dev
```

This will open a preview at `http://localhost:3001` where you can see all templates.

---

## Custom Domain Setup

For production, you should use a custom domain for better deliverability.

### Step 1: Add Domain in Resend

1. Go to your [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain (e.g., `advermo.com`)
4. Click **Add**

### Step 2: Verify Domain with DNS Records

Resend will provide DNS records. Add them to your domain:

**Example DNS Records:**

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `resend-verification=abc123...` |
| MX | `@` | `10 mx.resend.com` |
| TXT | `_dmarc` | `v=DMARC1; p=none;...` |
| TXT | `resend._domainkey` | `v=DKIM1; k=rsa; p=...` |

**DNS Provider Instructions:**

- **Cloudflare**: DNS > Add Record
- **GoDaddy**: DNS Management > Add
- **Namecheap**: Advanced DNS > Add New Record

### Step 3: Verify in Resend

1. Wait for DNS propagation (15 mins to 48 hours)
2. Click **Verify** in Resend dashboard
3. Once verified, update `.env.local`:

```env
EMAIL_FROM=Advermo <noreply@advermo.com>
```

### Step 4: Deploy to Production

Update environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `EMAIL_FROM` to your verified domain
4. Redeploy your application

---

## Troubleshooting

### Email Not Sending

**Symptom**: Email not received

**Solutions**:

1. **Check API Key**:
   ```bash
   echo $RESEND_API_KEY
   ```
   Should start with `re_`

2. **Check Logs**:
   ```bash
   # In terminal running dev server
   # Look for "Email send error:" messages
   ```

3. **Check Spam Folder**: Sometimes emails land in spam

4. **Verify Resend Dashboard**:
   - Go to [Resend Logs](https://resend.com/logs)
   - Check if email was sent
   - Check delivery status

### Email in Spam

**Solutions**:

1. **Use Custom Domain**: Improves deliverability
2. **Set up SPF, DKIM, DMARC**: Provided by Resend
3. **Avoid Spam Trigger Words**: Check email content
4. **Warm Up Domain**: Start with low volume, increase gradually

### Template Errors

**Symptom**: `Error rendering email`

**Solutions**:

1. **Check Props**: Ensure all required props are passed
2. **Check Imports**: Verify all components are imported
3. **Test Locally**: Use test endpoint to debug

### Rate Limiting

**Symptom**: `Rate limit exceeded`

**Solutions**:

1. **Free Tier**: 100 emails/day limit
2. **Upgrade Plan**: Consider paid plan for production
3. **Batch Emails**: Don't send too many at once

### Environment Variables Not Loading

**Solutions**:

1. **Restart Dev Server**: After changing `.env.local`
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check File Name**: Must be `.env.local` (not `.env`)

3. **Check Syntax**: No spaces around `=`
   ```env
   # ✅ Correct
   RESEND_API_KEY=re_abc123

   # ❌ Wrong
   RESEND_API_KEY = re_abc123
   ```

---

## API Reference

### Send Email

```typescript
import { sendEmail } from '@/lib/email/service';

const result = await sendEmail({
  to: 'user@example.com',
  subject: 'Hello!',
  react: <MyTemplate />,
  template: 'my_template',
  metadata: { userId: '123' },
});

if (result.success) {
  console.log('Email sent:', result.id);
} else {
  console.error('Email failed:', result.error);
}
```

### Check Email Preferences

```typescript
import { shouldSendEmail } from '@/lib/email/helpers';

const canSend = await shouldSendEmail(userId, 'booking_created');
if (canSend) {
  // Send email
}
```

### Format Helpers

```typescript
import { formatCurrency, formatDate } from '@/lib/email/helpers';

formatCurrency(15000); // "₹15,000"
formatDate(new Date()); // "11 Feb, 2026"
```

---

## Email Analytics

### View Email Logs

Access email logs via API:

```bash
curl http://localhost:3000/api/email/logs \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Monitor in Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/logs)
2. View:
   - Sent emails
   - Delivery status
   - Open rates (if enabled)
   - Click rates (if enabled)

---

## Cron Jobs

Email system includes automated cron jobs for:

### Campaign Reminders

- **Schedule**: Daily at 9:00 AM
- **Actions**:
  - Send "starting soon" emails (24h before)
  - Activate campaigns (on start date)
  - Complete campaigns (on end date)
  - Send review requests

### Payment Reminders

- **Schedule**: Twice daily (10 AM, 6 PM)
- **Actions**:
  - Remind users to complete payment (after 12h)
  - Auto-cancel unpaid bookings (after 24h)

**Testing Cron Jobs Locally**:

```bash
curl -X POST http://localhost:3000/api/cron/campaign-reminders
curl -X POST http://localhost:3000/api/cron/payment-reminders
```

---

## Best Practices

### 1. Email Design

- ✅ Keep it simple and focused
- ✅ Use clear CTAs (Call-to-Actions)
- ✅ Make it mobile-responsive
- ✅ Include unsubscribe link
- ❌ Don't use too many images
- ❌ Don't use background images (poor support)

### 2. Email Content

- ✅ Personalize with user's name
- ✅ Use action-oriented subject lines
- ✅ Keep subject under 50 characters
- ✅ Preview text should complement subject
- ❌ Avoid spam trigger words (FREE, WIN, URGENT)
- ❌ Don't use ALL CAPS

### 3. Sending

- ✅ Respect user preferences
- ✅ Handle failures gracefully
- ✅ Log all emails for debugging
- ✅ Monitor deliverability
- ❌ Don't send too frequently
- ❌ Don't ignore bounce rates

---

## Support

### Questions?

- **Email**: support@advermo.com
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **React Email Docs**: [react.email](https://react.email)

### Common Resources

- [Resend Dashboard](https://resend.com/overview)
- [React Email Components](https://react.email/docs/components/button)
- [Email Marketing Best Practices](https://resend.com/blog/email-best-practices)

---

*Last Updated: February 2026*
