import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatCurrency } from '@/lib/email/helpers';

interface PaymentFailedEmailProps {
  booking: {
    _id: string;
    spaceName: string;
    totalPrice: number;
  };
  error?: string;
}

export const PaymentFailedEmail = ({ booking, error }: PaymentFailedEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview="Payment failed - Action required">
      <Text style={heading}>Payment Failed ⚠️</Text>
      
      <Text style={paragraph}>
        We were unable to process your payment for <strong>{booking.spaceName}</strong>.
      </Text>

      <div style={errorBox}>
        <Text style={errorLabel}>What Happened:</Text>
        <Text style={errorText}>
          {error || 'Your payment could not be processed. This could be due to insufficient funds, incorrect card details, or a technical issue.'}
        </Text>
      </div>

      <Divider />

      <Text style={subheading}>What You Need to Do:</Text>
      
      <Text style={stepText}>
        <strong>1.</strong> Review your payment details (card number, expiry, CVV)
      </Text>
      <Text style={stepText}>
        <strong>2.</strong> Ensure you have sufficient balance
      </Text>
      <Text style={stepText}>
        <strong>3.</strong> Try again with the same or different payment method
      </Text>

      <div style={amountBox}>
        <Text style={amountLabel}>Amount Due:</Text>
        <Text style={amountValue}>{formatCurrency(booking.totalPrice)}</Text>
      </div>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/bookings/${booking._id}/payment`}>
          Retry Payment
        </Button>
      </div>

      <Text style={warningBox}>
        <strong>⏰ Important:</strong> Your booking will be automatically cancelled if payment is not completed within 24 hours of confirmation.
      </Text>

      <Divider />

      <Text style={paragraph}>
        <strong>Need Help?</strong>
      </Text>
      <Text style={paragraph}>
        If you continue to experience issues, please contact our support team:
      </Text>
      <Text style={paragraph}>
        Email:{' '}
        <Link href="mailto:billing@advermo.com" style={link}>
          billing@advermo.com
        </Link>
        <br />
        Phone: +91 80 1234 5678
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

const errorBox = {
  backgroundColor: '#fee2e2',
  borderLeft: '4px solid #ef4444',
  borderRadius: '4px',
  padding: '16px',
  margin: '0 0 20px 0',
};

const errorLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#991b1b',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const errorText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#991b1b',
  margin: 0,
};

const stepText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 12px 0',
  paddingLeft: '8px',
};

const amountBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const amountLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#8898aa',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
  letterSpacing: '0.5px',
};

const amountValue = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#667eea',
  margin: 0,
};

const warningBox = {
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

export default PaymentFailedEmail;
