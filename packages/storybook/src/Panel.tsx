import React from 'react';
import { AddonPanel } from '@storybook/components';
import { PanelContent } from './components/PanelContent';

export const Panel = (props) => {
  return (
    <AddonPanel {...props}>
      <PanelContent />
    </AddonPanel>
  );
};
