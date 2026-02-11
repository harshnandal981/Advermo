import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatDate } from '@/lib/email/helpers';

interface CampaignStartingSoonEmailProps {
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
    email: string;
  };
}

export const CampaignStartingSoonEmail = ({ booking, recipient, otherParty }: CampaignStartingSoonEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isBrand = recipient.role === 'brand';

  return (
    <EmailLayout preview={`Your campaign starts tomorrow at ${booking.spaceName}!`}>
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>📍</Text>
        <Text style={heading}>Campaign Starts Tomorrow!</Text>
      </div>
      
      <Text style={paragraph}>Hi {recipient.name},</Text>
      
      <Text style={paragraph}>
        This is a friendly reminder that your campaign at <strong>{booking.spaceName}</strong> begins tomorrow!
      </Text>

      <div style={campaignBox}>
        <Text style={campaignLabel}>Campaign Details</Text>
        <Text style={campaignDetail}>
          <strong>Space:</strong> {booking.spaceName}
        </Text>
        <Text style={campaignDetail}>
          <strong>Start Date:</strong> {formatDate(booking.startDate)}
        </Text>
        <Text style={campaignDetail}>
          <strong>End Date:</strong> {formatDate(booking.endDate)}
        </Text>
        <Text style={campaignDetail}>
          <strong>Duration:</strong> {booking.duration} days
        </Text>
      </div>

      <Divider />

      <Text style={subheading}>
        {isBrand ? 'Brand Checklist ✓' : 'Venue Checklist ✓'}
      </Text>
      
      {isBrand ? (
        <>
          <Text style={checklistItem}>□ Review campaign objectives and target audience</Text>
          <Text style={checklistItem}>□ Coordinate with venue owner for any last-minute details</Text>
          <Text style={checklistItem}>□ Monitor campaign launch and initial performance</Text>
          <Text style={checklistItem}>□ Stay in touch for any adjustments needed</Text>
        </>
      ) : (
        <>
          <Text style={checklistItem}>□ Ensure ad space is ready and accessible</Text>
          <Text style={checklistItem}>□ Install campaign materials as agreed</Text>
          <Text style={checklistItem}>□ Take photos for proof of delivery</Text>
          <Text style={checklistItem}>□ Upload proof to the platform</Text>
          <Text style={checklistItem}>□ Contact brand if you need any materials or clarifications</Text>
        </>
      )}

      <Divider />

      <Text style={subheading}>Contact Information</Text>
      
      <div style={contactBox}>
        <Text style={contactLabel}>
          {isBrand ? 'Venue Owner:' : 'Brand:'}
        </Text>
        <Text style={contactName}>{otherParty.name}</Text>
        <Text style={contactEmail}>
          <Link href={`mailto:${otherParty.email}`} style={link}>
            {otherParty.email}
          </Link>
        </Text>
      </div>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/bookings/${booking._id}`}>
          View Campaign Details
        </Button>
      </div>

      <Text style={successBox}>
        🚀 Everything is set! Your campaign will automatically go live tomorrow.
      </Text>

      <Text style={paragraph}>
        Need assistance? We're here to help!<br />
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

const campaignBox = {
  backgroundColor: '#e0e7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 20px 0',
  border: '2px solid #6366f1',
};

const campaignLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#3730a3',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px 0',
  letterSpacing: '0.5px',
};

const campaignDetail = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4338ca',
  margin: '0 0 8px 0',
};

const checklistItem = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 10px 0',
  paddingLeft: '8px',
};

const contactBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '16px',
  margin: '0 0 20px 0',
};

const contactLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#8898aa',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const contactName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#32325d',
  margin: '0 0 4px 0',
};

const contactEmail = {
  fontSize: '14px',
  color: '#667eea',
  margin: 0,
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

export default CampaignStartingSoonEmail;
