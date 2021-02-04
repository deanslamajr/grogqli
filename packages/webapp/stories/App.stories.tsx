import React from 'react';
import { Meta, Story } from '@storybook/react';

import { SessionsContainer } from '../src/App/SessionsContainer';

const meta: Meta = {
  title: 'SessionsContainer',
  component: SessionsContainer,
  args: {
    url: '/?s=taco',
  },
};

export default meta;

const Template: Story<{}> = () => <SessionsContainer />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
