import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import BookingDetails from './components/BookingDetails';
import Divider from './components/Divider';
import { Booking } from '@/types';

interface BookingReceivedEmailProps {
  booking: Partial<Booking>;
  brand: {
    name: string;
    email: string;
  };
  space: {
    name: string;
    location: string;
  };
}

export const BookingReceivedEmail = ({ booking, brand, space }: BookingReceivedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview={`New booking request for ${space.name}`}>
      <Text style={heading}>New Booking Request 📬</Text>
      
      <Text style={paragraph}>
        You have received a new booking request for <strong>{space.name}</strong>!
      </Text>

      <div style={brandInfo}>
        <Text style={brandLabel}>From Brand:</Text>
        <Text style={brandName}>{brand.name}</Text>
        <Text style={brandEmail}>{brand.email}</Text>
      </div>

      <BookingDetails booking={booking} />

      <Divider />

      <Text style={subheading}>Campaign Objective</Text>
      <Text style={paragraph}>{booking.campaignObjective}</Text>

      <Text style={subheading}>Target Audience</Text>
      <Text style={paragraph}>{booking.targetAudience}</Text>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Button href={`${appUrl}/host/bookings/${booking._id}?action=review`}>
          Review & Accept
        </Button>
        <div style={{ marginTop: '12px' }}>
          <Button href={`${appUrl}/host/bookings/${booking._id}?action=reject`} variant="secondary">
            Reject Request
          </Button>
        </div>
      </div>

      <Divider />

      <Text style={urgencyBox}>
        <strong>⚡ Action Required:</strong> Please respond within 48 hours. Quick responses help you secure more bookings and build trust with brands.
      </Text>

      <Text style={paragraph}>
        Need help? Contact us at{' '}
        <Link href="mailto:support@advermo.com" style={link}>
          support@advermo.com
        </Link>
      </Text>

      <Text style={signature}>
        Best regards,<br />
        The Advermo Team
      </Text>
    </EmailLayout>
  );
};

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#32325d',
  margin: '0 0 20px 0',
};

const subheading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#32325d',
  margin: '0 0 12px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
};

const brandInfo = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '16px',
  margin: '0 0 20px 0',
};

const brandLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#8898aa',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const brandName = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#32325d',
  margin: '0 0 4px 0',
};

const brandEmail = {
  fontSize: '14px',
  color: '#667eea',
  margin: 0,
};

const urgencyBox = {
  backgroundColor: '#dbeafe',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#1e40af',
  margin: '0 0 16px 0',
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: '500',
};

const signature = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '24px 0 0 0',
};

export default BookingReceivedEmail;
