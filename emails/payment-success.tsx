import { Text, Link, Row, Column } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';
import { formatCurrency, formatDateTime } from '@/lib/email/helpers';

interface PaymentSuccessEmailProps {
  payment: {
    _id: string;
    amount: number;
    transactionId: string;
    createdAt: Date | string;
  };
  booking: {
    _id: string;
    spaceName: string;
    startDate: Date | string;
    endDate: Date | string;
    duration: number;
  };
  invoice?: {
    subtotal: number;
    commission: number;
    gst: number;
    total: number;
  };
}

export const PaymentSuccessEmail = ({ payment, booking, invoice }: PaymentSuccessEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Calculate invoice if not provided
  const invoiceData = invoice || {
    subtotal: payment.amount,
    commission: Math.round(payment.amount * 0.1), // 10% commission
    gst: Math.round(payment.amount * 0.18), // 18% GST
    total: payment.amount,
  };

  return (
    <EmailLayout preview={`Payment successful - Receipt #${payment._id.slice(-8)}`}>
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>✓</Text>
        <Text style={heading}>Payment Successful!</Text>
      </div>
      
      <Text style={paragraph}>
        Thank you for your payment. Your booking for <strong>{booking.spaceName}</strong> is now confirmed and paid.
      </Text>

      <div style={receiptBox}>
        <Text style={receiptHeading}>Receipt #{payment._id.slice(-8)}</Text>
        <Text style={receiptDate}>
          {formatDateTime(payment.createdAt)}
        </Text>
      </div>

      <Divider />

      {/* Invoice Table */}
      <div style={invoiceTable}>
        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={tableLabel}>Booking:</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={tableValue}>{booking.spaceName}</Text>
          </Column>
        </Row>

        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={tableLabel}>Campaign Duration:</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={tableValue}>{booking.duration} days</Text>
          </Column>
        </Row>

        <Divider />

        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={tableLabel}>Subtotal:</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={tableValue}>{formatCurrency(invoiceData.subtotal)}</Text>
          </Column>
        </Row>

        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={tableLabel}>Platform Fee (10%):</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={tableValue}>{formatCurrency(invoiceData.commission)}</Text>
          </Column>
        </Row>

        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={tableLabel}>GST (18%):</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={tableValue}>{formatCurrency(invoiceData.gst)}</Text>
          </Column>
        </Row>

        <Divider />

        <Row style={tableRow}>
          <Column style={labelColumn}>
            <Text style={totalLabel}>Total Paid:</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={totalValue}>{formatCurrency(invoiceData.total)}</Text>
          </Column>
        </Row>
      </div>

      <div style={transactionBox}>
        <Text style={transactionLabel}>Transaction ID:</Text>
        <Text style={transactionId}>{payment.transactionId || payment._id}</Text>
      </div>

      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button href={`${appUrl}/bookings/${booking._id}/invoice`}>
          Download Invoice
        </Button>
      </div>

      <Divider />

      <Text style={successBox}>
        ✓ Your campaign will go live on {new Date(booking.startDate).toLocaleDateString('en-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>

      <Text style={paragraph}>
        Questions about your payment? Contact us at{' '}
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
const emoji = {
  fontSize: '64px',
  margin: '0 0 16px 0',
  color: '#10b981',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#32325d',
  margin: '0 0 24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
};

const receiptBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '20px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const receiptHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#32325d',
  margin: '0 0 8px 0',
};

const receiptDate = {
  fontSize: '14px',
  color: '#8898aa',
  margin: 0,
};

const invoiceTable = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '6px',
  padding: '20px',
  margin: '0 0 20px 0',
};

const tableRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '60%',
};

const valueColumn = {
  width: '40%',
  textAlign: 'right' as const,
};

const tableLabel = {
  fontSize: '14px',
  color: '#8898aa',
  margin: 0,
};

const tableValue = {
  fontSize: '14px',
  color: '#32325d',
  margin: 0,
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#32325d',
  margin: 0,
};

const totalValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#667eea',
  margin: 0,
};

const transactionBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  padding: '12px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const transactionLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#8898aa',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
  letterSpacing: '0.5px',
};

const transactionId = {
  fontSize: '14px',
  fontFamily: 'monospace',
  color: '#32325d',
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

export default PaymentSuccessEmail;
