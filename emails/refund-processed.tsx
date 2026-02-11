import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatCurrency, formatDateTime } from '@/lib/email/helpers';

interface RefundProcessedEmailProps {
  booking: {
    _id: string;
    spaceName: string;
  };
  refund: {
    amount: number;
    refundId: string;
    processedAt: Date | string;
    originalPaymentMethod: string;
  };
  cancellationReason?: string;
}

export const RefundProcessedEmail = ({ booking, refund, cancellationReason }: RefundProcessedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview={`Refund processed for booking #${booking._id.slice(-8)}`}>
      <Text style={heading}>Refund Processed ✓</Text>
      
      <Text style={paragraph}>
        Your refund for the cancelled booking of <strong>{booking.spaceName}</strong> has been successfully processed.
      </Text>

      <div style={refundBox}>
        <Text style={refundLabel}>Refund Amount:</Text>
        <Text style={refundAmount}>{formatCurrency(refund.amount)}</Text>
        <Text style={refundDate}>
          Processed on {formatDateTime(refund.processedAt)}
        </Text>
      </div>

      <Divider />

      <Text style={subheading}>Refund Details</Text>

      <div style={detailsBox}>
        <Text style={detailRow}>
          <strong>Refund ID:</strong> {refund.refundId}
        </Text>
        <Text style={detailRow}>
          <strong>Original Payment Method:</strong> {refund.originalPaymentMethod}
        </Text>
        <Text style={detailRow}>
          <strong>Booking ID:</strong> #{booking._id.slice(-8)}
        </Text>
      </div>

      {cancellationReason && (
        <>
          <Divider />
          <Text style={subheading}>Cancellation Reason</Text>
          <Text style={paragraph}>{cancellationReason}</Text>
        </>
      )}

      <Divider />

      <Text style={infoBox}>
        <strong>💳 When Will I Receive My Refund?</strong><br /><br />
        Refunds typically take 5-7 business days to appear in your account, depending on your bank or card issuer. 
        You should see the credit reflected as "{process.env.NEXT_PUBLIC_APP_NAME || 'Advermo'} Refund" on your statement.
      </Text>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/bookings/${booking._id}`}>
          View Booking Details
        </Button>
      </div>

      <Divider />

      <Text style={paragraph}>
        <strong>Still Need Ad Space?</strong><br />
        Browse our marketplace to find the perfect venue for your next campaign.
      </Text>

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <Button href={`${appUrl}/spaces`} variant="secondary">
          Browse Ad Spaces
        </Button>
      </div>

      <Text style={paragraph}>
        Questions about your refund? Contact us at{' '}
        <Link href="mailto:billing@advermo.com" style={link}>
          billing@advermo.com
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

const refundBox = {
  backgroundColor: '#d1fae5',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
  border: '2px solid #10b981',
};

const refundLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#065f46',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const refundAmount = {
  fontSize: '36px',
  fontWeight: 'bold',
  color: '#059669',
  margin: '0 0 8px 0',
};

const refundDate = {
  fontSize: '13px',
  color: '#047857',
  margin: 0,
};

const detailsBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '16px',
  margin: '0 0 20px 0',
};

const detailRow = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 8px 0',
};

const infoBox = {
  backgroundColor: '#e0e7ff',
  border: '1px solid #6366f1',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#3730a3',
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

export default RefundProcessedEmail;
