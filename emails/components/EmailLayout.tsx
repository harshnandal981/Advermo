import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

export const EmailLayout = ({ children, preview }: EmailLayoutProps) => {
  const currentYear = new Date().getFullYear();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Advermo';

  return (
    <Html>
      <Head />
      {preview && (
        <Text style={{ display: 'none', overflow: 'hidden', lineHeight: '1px', opacity: 0 }}>
          {preview}
        </Text>
      )}
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Link href={appUrl} style={logoLink}>
              <Text style={logo}>{appName}</Text>
            </Link>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              © {currentYear} {appName}. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href={`${appUrl}/settings/email-preferences`} style={footerLink}>
                Email Preferences
              </Link>
              {' • '}
              <Link href={`${appUrl}/support`} style={footerLink}>
                Support
              </Link>
              {' • '}
              <Link href={`${appUrl}/privacy`} style={footerLink}>
                Privacy
              </Link>
            </Text>
            <Text style={footerText}>
              Space Rental Marketplace for Advertising
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logoLink = {
  textDecoration: 'none',
};

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: 0,
};

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '40px 30px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '4px 0',
};

const footerLink = {
  color: '#667eea',
  textDecoration: 'none',
};

export default EmailLayout;
