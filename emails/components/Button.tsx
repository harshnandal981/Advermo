import { Button as EmailButton } from '@react-email/components';
import * as React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ href, children, variant = 'primary' }: ButtonProps) => {
  const buttonStyle = variant === 'primary' ? primaryButton : secondaryButton;
  
  return (
    <EmailButton href={href} style={buttonStyle}>
      {children}
    </EmailButton>
  );
};

const baseButton = {
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 28px',
  borderRadius: '6px',
  display: 'inline-block',
  lineHeight: '100%',
};

const primaryButton = {
  ...baseButton,
  backgroundColor: '#667eea',
  color: '#ffffff',
};

const secondaryButton = {
  ...baseButton,
  backgroundColor: '#f6f9fc',
  color: '#667eea',
  border: '1px solid #667eea',
};

export default Button;
