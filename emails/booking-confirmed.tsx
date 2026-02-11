import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import BookingDetails from './components/BookingDetails';
import Divider from './components/Divider';
import { Booking } from '@/types';

interface BookingConfirmedEmailProps {
  booking: Partial<Booking>;
  space: {
    name: string;
    location: string;
  };
}

export const BookingConfirmedEmail = ({ booking, space }: BookingConfirmedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isPaid = booking.paymentStatus === 'paid';

  return (
    <EmailLayout preview={`Your booking for ${space.name} is confirmed! 🎉`}>
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>🎉</Text>
        <Text style={heading}>Booking Confirmed!</Text>
      </div>
      
      <Text style={paragraph}>
        Congratulations! The venue owner has approved your booking request for <strong>{space.name}</strong>.
      </Text>

      <BookingDetails booking={booking} />

      <Divider />

      <Text style={subheading}>Next Steps:</Text>
      
      {!isPaid ? (
        <>
          <Text style={stepText}>
            <strong>1.</strong> Complete payment within 24 hours to secure your booking
          </Text>
          <Text style={stepText}>
            <strong>2.</strong> Receive payment confirmation and invoice
          </Text>
          <Text style={stepText}>
            <strong>3.</strong> Campaign goes live on your start date
          </Text>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={`${appUrl}/bookings/${booking._id}/payment`}>
              Complete Payment
            </Button>
          </div>

          <Text style={warningBox}>
            <strong>⚠️ Important:</strong> Your booking will be automatically cancelled if payment is not completed within 24 hours.
          </Text>
        </>
      ) : (
        <>
          <Text style={stepText}>
            <strong>1.</strong> Payment completed ✓
          </Text>
          <Text style={stepText}>
            <strong>2.</strong> Campaign starts on {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : 'scheduled date'}
          </Text>
          <Text style={stepText}>
            <strong>3.</strong> Monitor campaign performance in your dashboard
          </Text>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={`${appUrl}/bookings/${booking._id}`}>
              View Campaign Details
            </Button>
          </div>

          <Text style={successBox}>
            ✓ Payment received! Your campaign is all set to go live.
          </Text>
        </>
      )}

      <Divider />

      <Text style={paragraph}>
        <strong>Campaign Start Date:</strong>{' '}
        {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : 'TBD'}
      </Text>

      <Text style={paragraph}>
        We'll send you a reminder 24 hours before your campaign starts.
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
const emoji = {
  fontSize: '48px',
  margin: '0 0 16px 0',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#32325d',
  margin: '0 0 24px 0',
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

const warningBox = {
  backgroundColor: '#fee2e2',
  border: '1px solid #ef4444',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#991b1b',
  margin: '0 0 16px 0',
};

const successBox = {
  backgroundColor: '#d1fae5',
  border: '1px solid #10b981',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#065f46',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
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

export default BookingConfirmedEmail;
