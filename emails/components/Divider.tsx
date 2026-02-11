import { Hr } from '@react-email/components';
import * as React from 'react';

export const Divider = () => {
  return <Hr style={dividerStyle} />;
};

const dividerStyle = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

export default Divider;
