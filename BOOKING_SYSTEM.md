# Booking System Documentation

## Overview

The comprehensive booking system allows brands to request ad space bookings and venue owners to manage them. This system includes full CRUD operations, date conflict prevention, automatic pricing, and role-based access control.

## Features Implemented

### 1. Database Schema

**Booking Model** (`lib/models/Booking.ts`)
- Full booking information including dates, pricing, campaign details
- Status tracking (pending, confirmed, rejected, active, completed, cancelled)
- Payment status tracking
- Indexed fields for optimized queries
- Validation rules for dates, duration, and campaign details

### 2. API Routes

All routes are located in `/app/api/bookings/`:

#### POST `/api/bookings`
- Create new booking request
- **Authentication**: Required (brands only)
- **Validation**:
  - Start date must be at least 3 days in the future
  - End date must be after start date
  - Duration: 7-365 days
  - No conflicting bookings
  - Target audience minimum 10 characters
- **Auto-calculates**: Total price based on CPM and duration
- **Returns**: Created booking with ID

#### GET `/api/bookings`
- List user's bookings
- **Authentication**: Required
- **Query Parameters**:
  - `status`: Filter by status (optional)
  - `page`: Page number for pagination
  - `limit`: Results per page
- **Returns**: Array of bookings with pagination info

#### GET `/api/bookings/:id`
- Get single booking details
- **Authentication**: Required
- **Authorization**: Only accessible by brand or venue owner
- **Returns**: Full booking details

#### PATCH `/api/bookings/:id`
- Update booking status
- **Authentication**: Required
- **Actions**:
  - `confirm`: Venue owner confirms booking (pending → confirmed)
  - `reject`: Venue owner rejects booking (requires reason)
  - `cancel`: Brand cancels booking (pending/confirmed only)
  - `activate`: System marks as active when start date arrives
  - `complete`: System marks as completed when end date passes
- **Returns**: Updated booking

#### GET `/api/bookings/calendar/:spaceId`
- Get all confirmed/active bookings for a space
- **Authentication**: Not required (public)
- **Returns**: Array of booked date ranges

#### GET `/api/bookings/stats`
- Get venue owner dashboard statistics
- **Authentication**: Required (venue owners only)
- **Returns**: Booking counts and total revenue

### 3. UI Components

Located in `/components/bookings/`:

#### BookingForm
- Interactive form for creating booking requests
- Real-time price calculation
- Date validation with visual feedback
- Fields:
  - Start/End date pickers
  - Campaign objective dropdown
  - Target audience input
  - Budget (optional)
  - Additional notes (optional)
- Shows calculated: duration, impressions, total price

#### BookingCard
- Compact booking display for lists
- Shows space thumbnail, dates, status, price
- Role-based action buttons:
  - Venue owners: Accept/Reject
  - Brands: Cancel, View Details
- Rejection modal with reason input

#### BookingDetails
- Full booking information page
- Sections:
  - Space details with image
  - Campaign information
  - Payment details
  - Booking parties (brand & venue owner)
  - Status timeline
  - Action buttons
- Rejection reason display (if applicable)

#### BookingsCalendar
- Visual calendar showing booked dates
- Fetches from calendar API
- Highlights unavailable date ranges
- Empty state when no bookings

#### BookingStatusBadge
- Colored status badges with icons
- Status-specific colors:
  - Pending: Yellow
  - Confirmed: Green
  - Rejected: Red
  - Active: Blue
  - Completed: Gray
  - Cancelled: Gray

### 4. Pages

#### `/app/bookings/page.tsx` - My Bookings (Brands)
- Lists all brand's booking requests
- Tabs for filtering: All, Pending, Confirmed, Active, Completed
- Empty state with link to browse spaces
- Redirects to home if not authenticated

#### `/app/bookings/[id]/page.tsx` - Booking Details
- Full booking details view
- Server-side rendered
- Access control (brand or venue owner only)
- Action buttons based on status and role

#### `/app/host/bookings/page.tsx` - Manage Bookings (Venue Owners)
- Venue owner booking management dashboard
- Statistics cards:
  - Pending count
  - Active count
  - Completed count
  - Total revenue
- Tabs with notification badge for pending bookings
- Quick accept/reject actions

#### `/app/spaces/[id]/page.tsx` - Updated Space Details
- Integrated BookingForm for brands
- BookingsCalendar showing availability
- Role-based display:
  - Brands: Booking form
  - Venue owners: "Your listing" message
  - Guests: Sign-in prompt

### 5. Navigation Updates

**Header Component** (`components/layout/header.tsx`)
- Added "My Bookings" link for brands
- Added "Manage Bookings" link for venue owners
- Updated user menu with booking links
- Mobile menu includes booking navigation

## Business Logic

### Date Conflict Prevention

Function: `checkDateConflict()`
- Checks if new booking overlaps with existing confirmed/active bookings
- Prevents double-booking of ad spaces
- Runs before creating new bookings

### Price Calculation

Formula: `(dailyFootfall × duration / 1000) × CPM`

Example:
- Daily Footfall: 2,500 people
- Duration: 30 days
- CPM: ₹200
- Total Impressions: 2,500 × 30 = 75,000
- Total Price: (75,000 / 1,000) × 200 = ₹15,000

### Status Transitions

```
pending → confirmed (venue owner accepts)
pending → rejected (venue owner rejects)
confirmed → active (auto-update on start date)
active → completed (auto-update on end date)
any → cancelled (brand cancels)
```

### Validation Rules

1. **Start Date**: Must be at least 3 days in the future
2. **Duration**: 7-365 days
3. **Target Audience**: Minimum 10 characters
4. **Campaign Objective**: Required selection
5. **Budget**: Optional, must be positive if provided
6. **Notes**: Optional, max 1000 characters
7. **Rejection Reason**: Required when rejecting, max 500 characters

## User Flows

### Brand Flow: Creating a Booking

1. Browse ad spaces at `/spaces`
2. Click on a space to view details
3. Fill out booking form:
   - Select start and end dates
   - Choose campaign objective
   - Enter target audience
   - Add budget (optional)
   - Add notes (optional)
4. Review calculated price
5. Submit booking request
6. Redirected to booking details page
7. Wait for venue owner to accept/reject

### Brand Flow: Managing Bookings

1. Navigate to "My Bookings"
2. View all bookings with filters
3. Click "View Details" for more info
4. Cancel if needed (pending/confirmed only)

### Venue Owner Flow: Managing Requests

1. Navigate to "Manage Bookings"
2. See dashboard with stats
3. Click "Pending" tab
4. Review booking details:
   - Campaign objective
   - Target audience
   - Dates and duration
   - Offered price
5. Either:
   - Accept booking → Status changes to confirmed
   - Reject booking → Provide reason
6. Track active and completed bookings

## Type Definitions

Located in `/types/index.ts`:

```typescript
export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'rejected' 
  | 'active' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'refunded';

export interface Booking {
  _id: string;
  spaceId: string;
  spaceName: string;
  brandId: string;
  brandName: string;
  brandEmail: string;
  venueOwnerId: string;
  venueOwnerEmail: string;
  startDate: Date | string;
  endDate: Date | string;
  duration: number;
  campaignObjective: string;
  targetAudience: string;
  budget?: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
```

## Testing Checklist

- [x] Brands can create booking requests
- [x] Date conflicts are prevented
- [x] Price calculation is accurate
- [x] Venue owners see booking requests
- [x] Venue owners can accept/reject bookings
- [x] Brands can view their bookings
- [x] Status badges display correctly
- [x] Calendar shows unavailable dates
- [x] Dark mode works
- [x] Mobile responsive
- [x] Protected routes work (authentication)
- [x] Role-based permissions enforced
- [x] Build succeeds without errors
- [x] Lint passes without errors

## Future Enhancements

### Short Term
1. Email notifications
   - New booking request → Venue owner
   - Booking confirmed → Brand
   - Booking rejected → Brand
   - Booking starts tomorrow → Both parties
   - Booking completed → Both parties

2. Payment integration
   - Stripe/Razorpay integration
   - Payment processing on confirmation
   - Refund handling for cancellations

3. Auto-status updates
   - Cron job to mark bookings as active/completed
   - Vercel Cron Jobs integration

### Long Term
1. Advanced calendar UI
   - React Day Picker integration
   - Visual date range selection
   - Month/week views

2. Booking modifications
   - Extend booking duration
   - Modify dates (with approval)
   - Upgrade campaign

3. Analytics dashboard
   - Booking trends
   - Revenue forecasting
   - Popular spaces
   - Campaign performance

4. Dispute resolution
   - Mediation system
   - Evidence upload
   - Resolution workflow

## Security Considerations

1. **Authentication**: All booking operations require valid session
2. **Authorization**: Role-based access control enforced
3. **Data Validation**: Server-side validation for all inputs
4. **SQL Injection**: Protected by Mongoose ORM
5. **XSS**: React automatically escapes outputs
6. **CSRF**: NextAuth handles CSRF protection
7. **Rate Limiting**: Should be added for production

## Performance Optimizations

1. **Database Indexes**:
   - Single field: `brandId`, `venueOwnerId`, `spaceId`, `status`
   - Compound: `{ brandId, status }`, `{ venueOwnerId, status }`
   - Date range: `{ spaceId, startDate, endDate }`

2. **Pagination**: Implemented for all list endpoints

3. **Lean Queries**: Using `.lean()` for read-only operations

4. **Caching**: Can add Redis for stats and calendar data

## Deployment Notes

1. Set up MongoDB Atlas connection
2. Configure environment variables in Vercel
3. Set up Vercel Cron Jobs for auto-status updates (optional)
4. Configure email service (optional)
5. Set up payment gateway (optional)

## Support

For issues or questions about the booking system:
1. Check this documentation
2. Review API error messages
3. Check browser console for client-side errors
4. Review server logs for API errors
