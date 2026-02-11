import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import BookingDetails from './components/BookingDetails';
import Divider from './components/Divider';
import { Booking } from '@/types';

interface BookingCreatedEmailProps {
  booking: Partial<Booking>;
  space: {
    name: string;
    location: string;
  };
}

export const BookingCreatedEmail = ({ booking, space }: BookingCreatedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview="Your booking request has been submitted successfully">
      <Text style={heading}>Booking Request Submitted ✓</Text>
      
      <Text style={paragraph}>
        Great news! Your booking request for <strong>{space.name}</strong> has been successfully submitted and is awaiting venue owner approval.
      </Text>

      <BookingDetails booking={booking} />

      <Divider />

      <Text style={subheading}>What Happens Next?</Text>
      
      <Text style={stepText}>
        <strong>1.</strong> The venue owner will review your request (typically within 48 hours)
      </Text>
      <Text style={stepText}>
        <strong>2.</strong> You'll receive a notification once they respond
      </Text>
      <Text style={stepText}>
        <strong>3.</strong> If approved, complete payment within 24 hours to confirm your booking
      </Text>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Button href={`${appUrl}/bookings/${booking._id}`}>
          View Booking Details
        </Button>
      </div>

      <Divider />

      <Text style={infoBox}>
        <strong>⏰ Payment Reminder:</strong> Once approved, please complete payment within 24 hours to secure your booking. Unpaid bookings will be automatically cancelled.
      </Text>

      <Text style={paragraph}>
        Questions? Contact us at{' '}
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
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
};

const stepText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 12px 0',
  paddingLeft: '8px',
};

const infoBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#92400e',
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

export default BookingCreatedEmail;
