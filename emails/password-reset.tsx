import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';

interface PasswordResetEmailProps {
  user: {
    name: string;
  };
  resetLink: string;
  expiryTime?: string;
}

export const PasswordResetEmail = ({ user, resetLink, expiryTime = '1 hour' }: PasswordResetEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview="Reset your Advermo password">
      <Text style={heading}>Reset Your Password</Text>
      
      <Text style={paragraph}>Hi {user.name},</Text>
      
      <Text style={paragraph}>
        We received a request to reset your password for your Advermo account. Click the button below to create a new password:
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={resetLink}>
          Reset Password
        </Button>
      </div>

      <Text style={warningBox}>
        <strong>⏰ Important:</strong> This link will expire in {expiryTime}. After that, you'll need to request a new password reset.
      </Text>

      <Divider />

      <Text style={subheading}>Security Tips:</Text>
      
      <Text style={tipText}>
        • Use a strong password with at least 8 characters
      </Text>
      <Text style={tipText}>
        • Include uppercase and lowercase letters, numbers, and symbols
      </Text>
      <Text style={tipText}>
        • Don't reuse passwords from other accounts
      </Text>
      <Text style={tipText}>
        • Never share your password with anyone
      </Text>

      <Divider />

      <div style={infoBox}>
        <Text style={infoText}>
          <strong>Didn't request a password reset?</strong><br /><br />
          If you didn't make this request, you can safely ignore this email. Your password will remain unchanged, and your account is secure.
        </Text>
      </div>

      <Text style={paragraph}>
        If you're having trouble clicking the button, copy and paste this URL into your browser:
      </Text>
      <Text style={urlText}>
        {resetLink}
      </Text>

      <Divider />

      <Text style={paragraph}>
        Need help? Contact our support team at{' '}
        <Link href="mailto:support@advermo.com" style={link}>
          support@advermo.com
        </Link>
      </Text>

      <Text style={signature}>
        Best regards,<br />
        The Advermo Security Team
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

const tipText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 8px 0',
  paddingLeft: '8px',
};

const infoBox = {
  backgroundColor: '#e0e7ff',
  borderRadius: '6px',
  padding: '20px',
  margin: '0 0 16px 0',
  border: '1px solid #6366f1',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#3730a3',
  margin: 0,
};

const urlText = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#8898aa',
  wordBreak: 'break-all' as const,
  backgroundColor: '#f6f9fc',
  padding: '12px',
  borderRadius: '4px',
  fontFamily: 'monospace',
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

export default PasswordResetEmail;
