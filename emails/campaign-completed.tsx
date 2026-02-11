import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatDate } from '@/lib/email/helpers';

interface CampaignCompletedEmailProps {
  booking: {
    _id: string;
    spaceName: string;
    startDate: Date | string;
    endDate: Date | string;
    duration: number;
  };
  recipient: {
    name: string;
    role: 'brand' | 'venue';
  };
  otherParty: {
    name: string;
  };
  metrics?: {
    totalImpressions?: number;
    avgDailyFootfall?: number;
  };
}

export const CampaignCompletedEmail = ({ booking, recipient, otherParty, metrics }: CampaignCompletedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isBrand = recipient.role === 'brand';

  return (
    <EmailLayout preview={`Campaign completed at ${booking.spaceName} - Leave a review!`}>
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>⭐</Text>
        <Text style={heading}>Campaign Completed!</Text>
      </div>
      
      <Text style={paragraph}>Hi {recipient.name},</Text>
      
      <Text style={paragraph}>
        Your campaign at <strong>{booking.spaceName}</strong> has successfully completed. Thank you for using Advermo!
      </Text>

      <div style={summaryBox}>
        <Text style={summaryLabel}>Campaign Summary</Text>
        <Text style={summaryDetail}>
          <strong>Space:</strong> {booking.spaceName}
        </Text>
        <Text style={summaryDetail}>
          <strong>Duration:</strong> {booking.duration} days
        </Text>
        <Text style={summaryDetail}>
          <strong>Period:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
        </Text>
        {metrics?.totalImpressions && (
          <Text style={summaryDetail}>
            <strong>Total Impressions:</strong> {metrics.totalImpressions.toLocaleString('en-IN')}
          </Text>
        )}
      </div>

      <Divider />

      <Text style={subheading}>How Was Your Experience?</Text>
      
      <Text style={paragraph}>
        Your feedback helps us improve the platform and helps other{' '}
        {isBrand ? 'brands' : 'venue owners'} make better decisions.
      </Text>

      <Text style={paragraph}>
        Please take a moment to rate your experience with{' '}
        <strong>{otherParty.name}</strong>:
      </Text>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/bookings/${booking._id}/review`}>
          Leave a Review ⭐
        </Button>
      </div>

      <Divider />

      {isBrand ? (
        <>
          <Text style={subheading}>What's Next?</Text>
          
          <Text style={nextStepText}>
            <strong>Launch Another Campaign</strong><br />
            Browse our marketplace for your next advertising opportunity
          </Text>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <Button href={`${appUrl}/spaces`} variant="secondary">
              Browse Ad Spaces
            </Button>
          </div>
        </>
      ) : (
        <>
          <Text style={subheading}>Keep Growing Your Business</Text>
          
          <Text style={nextStepText}>
            <strong>Get More Bookings</strong><br />
            Make sure your space is always listed and available for new campaigns
          </Text>

          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <Button href={`${appUrl}/host/dashboard`} variant="secondary">
              View Dashboard
            </Button>
          </div>
        </>
      )}

      <Text style={thanksBox}>
        🙏 Thank you for being part of the Advermo community!
      </Text>

      <Text style={paragraph}>
        Questions or feedback? We'd love to hear from you at{' '}
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
  fontSize: '64px',
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

const summaryBox = {
  backgroundColor: '#e0e7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 20px 0',
  border: '2px solid #6366f1',
};

const summaryLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3730a3',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px 0',
  letterSpacing: '0.5px',
};

const summaryDetail = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4338ca',
  margin: '0 0 8px 0',
};

const nextStepText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
  paddingLeft: '8px',
};

const thanksBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#92400e',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
  fontWeight: '500',
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

export default CampaignCompletedEmail;
