import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatDate, formatCurrency } from '@/lib/email/helpers';

interface BookingCancelledEmailProps {
  booking: {
    _id: string;
    spaceName: string;
    startDate: Date | string;
    endDate: Date | string;
    totalPrice?: number;
  };
  cancelledBy: 'brand' | 'venue' | 'system';
  reason?: string;
  refundInfo?: {
    willRefund: boolean;
    amount?: number;
    processingTime?: string;
  };
}

export const BookingCancelledEmail = ({ booking, cancelledBy, reason, refundInfo }: BookingCancelledEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview={`Booking cancelled for ${booking.spaceName}`}>
      <Text style={heading}>Booking Cancelled</Text>
      
      <Text style={paragraph}>
        Your booking for <strong>{booking.spaceName}</strong> has been cancelled.
      </Text>

      <div style={infoBox}>
        <Text style={infoDetail}>
          <strong>Booking ID:</strong> #{booking._id.slice(-8)}
        </Text>
        <Text style={infoDetail}>
          <strong>Space:</strong> {booking.spaceName}
        </Text>
        <Text style={infoDetail}>
          <strong>Dates:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
        </Text>
        <Text style={infoDetail}>
          <strong>Cancelled by:</strong> {
            cancelledBy === 'brand' ? 'Brand' : 
            cancelledBy === 'venue' ? 'Venue Owner' : 
            'System (Payment timeout)'
          }
        </Text>
      </div>

      {reason && (
        <>
          <Divider />
          <Text style={subheading}>Cancellation Reason</Text>
          <Text style={reasonText}>{reason}</Text>
        </>
      )}

      {refundInfo && (
        <>
          <Divider />
          <Text style={subheading}>Refund Information</Text>
          
          {refundInfo.willRefund ? (
            <div style={refundBox}>
              <Text style={refundText}>
                ✓ A refund of <strong>{formatCurrency(refundInfo.amount || booking.totalPrice || 0)}</strong> will be processed
              </Text>
              <Text style={refundDetail}>
                Refunds typically take {refundInfo.processingTime || '5-7 business days'} to appear in your account
              </Text>
            </div>
          ) : (
            <Text style={paragraph}>
              No payment was made for this booking, so no refund is necessary.
            </Text>
          )}
        </>
      )}

      <Divider />

      <Text style={subheading}>What's Next?</Text>
      
      <Text style={paragraph}>
        Don't let this stop you! We have thousands of other amazing spaces available for your advertising needs.
      </Text>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/spaces`}>
          Browse Ad Spaces
        </Button>
      </div>

      <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <Button href={`${appUrl}/bookings`} variant="secondary">
          View My Bookings
        </Button>
      </div>

      <Divider />

      <Text style={paragraph}>
        Need help or have questions? Contact us at{' '}
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

const infoBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '20px',
  margin: '0 0 20px 0',
  border: '1px solid #e6ebf1',
};

const infoDetail = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 8px 0',
};

const reasonText = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  borderRadius: '4px',
  padding: '16px',
  fontSize: '15px',
  lineHeight: '22px',
  color: '#78350f',
  margin: '0 0 16px 0',
};

const refundBox = {
  backgroundColor: '#d1fae5',
  borderRadius: '6px',
  padding: '16px',
  margin: '0 0 16px 0',
  border: '1px solid #10b981',
};

const refundText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#065f46',
  margin: '0 0 8px 0',
};

const refundDetail = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#047857',
  margin: 0,
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

export default BookingCancelledEmail;
