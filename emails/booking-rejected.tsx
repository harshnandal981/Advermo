import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { Booking } from '@/types';

interface BookingRejectedEmailProps {
  booking: Partial<Booking>;
  space: {
    name: string;
    location: string;
  };
  reason?: string;
}

export const BookingRejectedEmail = ({ booking, space, reason }: BookingRejectedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview={`Booking request update for ${space.name}`}>
      <Text style={heading}>Booking Request Update</Text>
      
      <Text style={paragraph}>
        We wanted to update you on your booking request for <strong>{space.name}</strong>.
      </Text>

      <Text style={paragraph}>
        Unfortunately, the venue owner is unable to accommodate your request at this time.
      </Text>

      {reason && (
        <div style={reasonBox}>
          <Text style={reasonLabel}>Reason:</Text>
          <Text style={reasonText}>{reason}</Text>
        </div>
      )}

      <Divider />

      <Text style={subheading}>Don't Give Up! Here's What You Can Do:</Text>
      
      <Text style={suggestionText}>
        <strong>1. Browse Similar Spaces</strong><br />
        We have hundreds of similar venues that might be perfect for your campaign.
      </Text>
      
      <Text style={suggestionText}>
        <strong>2. Adjust Your Dates</strong><br />
        The venue might be available on different dates. Try adjusting your campaign timeline.
      </Text>
      
      <Text style={suggestionText}>
        <strong>3. Contact Support</strong><br />
        Our team can help you find the perfect space for your needs.
      </Text>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/spaces?similar=${space.name}`}>
          Browse Similar Spaces
        </Button>
      </div>

      <Divider />

      <Text style={paragraph}>
        Need help finding the right space? Our team is here to help!<br />
        Contact us at{' '}
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

const reasonBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  padding: '16px',
  margin: '0 0 20px 0',
};

const reasonLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#92400e',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const reasonText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#78350f',
  margin: 0,
};

const suggestionText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#525f7f',
  margin: '0 0 16px 0',
  paddingLeft: '8px',
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

export default BookingRejectedEmail;
