import { Text, Link } from '@react-email/components';
import * as React from 'react';
import EmailLayout from './components/EmailLayout';
import Button from './components/Button';
import Section from './components/Section';
import Divider from './components/Divider';

interface WelcomeEmailProps {
  user: {
    name: string;
    email: string;
    role: 'brand' | 'venue';
  };
}

export const WelcomeEmail = ({ user }: WelcomeEmailProps) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isBrand = user.role === 'brand';

  return (
    <EmailLayout preview={`Welcome to Advermo, ${user.name}! 🎉`}>
      <Text style={heading}>Welcome to Advermo! 🎉</Text>
      
      <Text style={paragraph}>Hi {user.name},</Text>
      
      <Text style={paragraph}>
        Thank you for joining Advermo, India's premier space rental marketplace for advertising!
        {isBrand
          ? " We're excited to help you reach your target audience through strategic ad placements."
          : " We're excited to help you monetize your venue space!"}
      </Text>

      <Section>
        <Text style={subheading}>What You Can Do:</Text>
        {isBrand ? (
          <>
            <Text style={featureText}>
              ✓ Browse thousands of premium ad spaces across cafes, gyms, malls, and more
            </Text>
            <Text style={featureText}>
              ✓ Target specific demographics and locations
            </Text>
            <Text style={featureText}>
              ✓ Launch campaigns in minutes with instant booking
            </Text>
            <Text style={featureText}>
              ✓ Track impressions and campaign performance
            </Text>
          </>
        ) : (
          <>
            <Text style={featureText}>
              ✓ List your venue spaces and start earning
            </Text>
            <Text style={featureText}>
              ✓ Set your own pricing and availability
            </Text>
            <Text style={featureText}>
              ✓ Connect with top brands looking for ad placements
            </Text>
            <Text style={featureText}>
              ✓ Manage bookings and campaigns easily
            </Text>
          </>
        )}
      </Section>

      <Divider />

      <Section style={{ textAlign: 'center' }}>
        {isBrand ? (
          <Button href={`${appUrl}/spaces`}>
            Browse Ad Spaces
          </Button>
        ) : (
          <Button href={`${appUrl}/host/new`}>
            List Your Venue
          </Button>
        )}
      </Section>

      <Divider />

      <Text style={paragraph}>
        <strong>Need help getting started?</strong>
      </Text>
      <Text style={paragraph}>
        Check out our{' '}
        <Link href={`${appUrl}/guide`} style={link}>
          quick start guide
        </Link>{' '}
        or contact our support team at{' '}
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
  margin: '0 0 12px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px 0',
};

const featureText = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#525f7f',
  margin: '0 0 8px 0',
  paddingLeft: '8px',
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

export default WelcomeEmail;
