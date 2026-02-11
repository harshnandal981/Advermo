import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Divider from './components/Divider';

interface EmailVerificationEmailProps {
  user: {
    name: string;
    email: string;
  };
  verificationLink: string;
}

export const EmailVerificationEmail = ({ user, verificationLink }: EmailVerificationEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <EmailLayout preview="Verify your email address">
      <div style={{ textAlign: 'center' }}>
        <Text style={emoji}>✉️</Text>
        <Text style={heading}>Verify Your Email</Text>
      </div>
      
      <Text style={paragraph}>Hi {user.name},</Text>
      
      <Text style={paragraph}>
        Thanks for signing up for Advermo! To get started, please verify your email address by clicking the button below:
      </Text>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button href={verificationLink}>
          Verify Email Address
        </Button>
      </div>

      <Text style={infoBox}>
        This helps us ensure that you have access to this email address and can receive important notifications about your bookings and campaigns.
      </Text>

      <Divider />

      <Text style={subheading}>What You'll Get After Verification:</Text>
      
      <Text style={benefitText}>
        ✓ Full access to all platform features
      </Text>
      <Text style={benefitText}>
        ✓ Ability to create and manage bookings
      </Text>
      <Text style={benefitText}>
        ✓ Important email notifications
      </Text>
      <Text style={benefitText}>
        ✓ Secure account protection
      </Text>

      <Divider />

      <Text style={paragraph}>
        If you're having trouble clicking the button, copy and paste this URL into your browser:
      </Text>
      <Text style={urlText}>
        {verificationLink}
      </Text>

      <Divider />

      <div style={helpBox}>
        <Text style={helpText}>
          <strong>Didn't create an account?</strong><br /><br />
          If you didn't sign up for Advermo, you can safely ignore this email. Your email address will not be used.
        </Text>
      </div>

      <Text style={paragraph}>
        Questions? Contact us at{' '}
        <Link href="mailto:support@advermo.com" style={link}>
          support@advermo.com
        </Link>
      </Text>

      <Text style={signature}>
        Welcome aboard!<br />
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

const infoBox = {
  backgroundColor: '#e0e7ff',
  borderRadius: '6px',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '20px',
  color: '#3730a3',
  margin: '0 0 16px 0',
  border: '1px solid #6366f1',
};

const benefitText = {
  fontSize: '15px',
  lineHeight: '28px',
  color: '#525f7f',
  margin: '0 0 4px 0',
  paddingLeft: '8px',
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

const helpBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '6px',
  padding: '20px',
  margin: '0 0 16px 0',
  border: '1px solid #e6ebf1',
};

const helpText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#525f7f',
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

export default EmailVerificationEmail;
