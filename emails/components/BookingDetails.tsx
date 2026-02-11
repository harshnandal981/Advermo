import { Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/email/helpers';

interface BookingDetailsProps {
  booking: Partial<Booking>;
  showPrice?: boolean;
}

export const BookingDetails = ({ booking, showPrice = true }: BookingDetailsProps) => {
  return (
    <div style={container}>
      <Text style={heading}>Booking Details</Text>
      
      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Space:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>{booking.spaceName || 'N/A'}</Text>
        </Column>
      </Row>

      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Booking ID:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>#{booking._id?.slice(-8) || 'N/A'}</Text>
        </Column>
      </Row>

      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Campaign Dates:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>
            {booking.startDate ? formatDate(new Date(booking.startDate)) : 'N/A'} - {booking.endDate ? formatDate(new Date(booking.endDate)) : 'N/A'}
          </Text>
        </Column>
      </Row>

      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Duration:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>{booking.duration || 0} days</Text>
        </Column>
      </Row>

      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Objective:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={value}>{booking.campaignObjective || 'N/A'}</Text>
        </Column>
      </Row>

      {showPrice && booking.totalPrice && (
        <Row style={row}>
          <Column style={labelColumn}>
            <Text style={label}>Total Price:</Text>
          </Column>
          <Column style={valueColumn}>
            <Text style={priceValue}>{formatCurrency(booking.totalPrice)}</Text>
          </Column>
        </Row>
      )}

      <Row style={row}>
        <Column style={labelColumn}>
          <Text style={label}>Status:</Text>
        </Column>
        <Column style={valueColumn}>
          <Text style={statusBadge(booking.status || 'pending')}>
            {(booking.status || 'pending').toUpperCase()}
          </Text>
        </Column>
      </Row>
    </div>
  );
};

// Styles
const container = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '20px',
  margin: '20px 0',
};

const heading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#32325d',
  margin: '0 0 16px 0',
};

const row = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '40%',
  paddingRight: '10px',
};

const valueColumn = {
  width: '60%',
};

const label = {
  fontSize: '14px',
  color: '#8898aa',
  margin: 0,
  fontWeight: '500',
};

const value = {
  fontSize: '14px',
  color: '#32325d',
  margin: 0,
};

const priceValue = {
  fontSize: '16px',
  color: '#667eea',
  margin: 0,
  fontWeight: '600',
};

const statusBadge = (status: string) => ({
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  backgroundColor: getStatusColor(status).bg,
  color: getStatusColor(status).text,
  margin: 0,
});

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    confirmed: { bg: '#d1fae5', text: '#065f46' },
    rejected: { bg: '#fee2e2', text: '#991b1b' },
    active: { bg: '#dbeafe', text: '#1e40af' },
    completed: { bg: '#e0e7ff', text: '#3730a3' },
    cancelled: { bg: '#f3f4f6', text: '#374151' },
  };
  return colors[status] || colors.pending;
};

export default BookingDetails;
