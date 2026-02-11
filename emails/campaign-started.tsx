import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatDate } from '@/lib/email/helpers';

interface CampaignStartedEmailProps {
  booking: {
    _id: string;
    spaceName: string;
    endDate: Date | string;
    duration: number;
  };
  recipient: {
    name: string;
    role: 'brand' | 'venue';
  };
}

export const CampaignStartedEmail = ({ booking, recipient }: CampaignStartedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isBrand = recipient.role === 'brand';

  return (
    <EmailLayout preview={`Your campaign is now live at ${booking.spaceName}!`}>
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>🚀</Text>
        <Text style={heading}>Your Campaign is Now Live!</Text>
      </div>
      
      <Text style={paragraph}>Hi {recipient.name},</Text>
      
      <Text style={paragraph}>
        Great news! Your campaign at <strong>{booking.spaceName}</strong> has officially started and is now active.
      </Text>

      <div style={statusBox}>
        <Text style={statusLabel}>Campaign Status</Text>
        <Text style={statusValue}>ACTIVE</Text>
        <Text style={statusDetail}>
          Ends on {formatDate(booking.endDate)} ({booking.duration} days remaining)
        </Text>
      </div>

      <Divider />

      {isBrand ? (
        <>
          <Text style={subheading}>What to Do Now:</Text>
          
          <Text style={actionText}>
            <strong>1. Monitor Performance</strong><br />
            Track impressions and engagement in your dashboard
          </Text>
          
          <Text style={actionText}>
            <strong>2. Stay Connected</strong><br />
            The venue will upload proof-of-delivery photos soon
          </Text>
          
          <Text style={actionText}>
            <strong>3. Provide Feedback</strong><br />
            Share any concerns or observations with the venue owner
          </Text>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={`${appUrl}/bookings/${booking._id}/analytics`}>
              View Analytics
            </Button>
          </div>
        </>
      ) : (
        <>
          <Text style={subheading}>Action Required:</Text>
          
          <Text style={actionText}>
            <strong>1. Upload Proof of Delivery</strong><br />
            Take photos of the installed campaign materials and upload them to the platform
          </Text>
          
          <Text style={actionText}>
            <strong>2. Maintain Campaign Quality</strong><br />
            Ensure materials remain in good condition throughout the campaign
          </Text>
          
          <Text style={actionText}>
            <strong>3. Respond to Brand Feedback</strong><br />
            Address any concerns or requests from the brand promptly
          </Text>

          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={`${appUrl}/host/bookings/${booking._id}/upload-proof`}>
              Upload Proof
            </Button>
          </div>

          <Text style={reminderBox}>
            📸 <strong>Reminder:</strong> Upload proof-of-delivery within 48 hours to ensure timely payment release.
          </Text>
        </>
      )}

      <Divider />

      <Text style={paragraph}>
        Questions or issues? Contact us at{' '}
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

const statusBox = {
  backgroundColor: '#d1fae5',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
  border: '2px solid #10b981',
};

const statusLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#065f46',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const statusValue = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#059669',
  margin: '0 0 8px 0',
};

const statusDetail = {
  fontSize: '14px',
  color: '#047857',
  margin: 0,
};

const actionText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
  paddingLeft: '8px',
};

const reminderBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
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

export default CampaignStartedEmail;
