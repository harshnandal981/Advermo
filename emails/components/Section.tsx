import { Section as EmailSection } from '@react-email/components';
import * as React from 'react';

interface SectionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Section = ({ children, style }: SectionProps) => {
  return (
    <EmailSection style={{ ...defaultStyle, ...style }}>
      {children}
    </EmailSection>
  );
};

const defaultStyle = {
  margin: '20px 0',
};

export default Section;
