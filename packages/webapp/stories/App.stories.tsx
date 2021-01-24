import React from 'react';
import { Meta, Story } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../src';

import { createApolloClient } from './apollo-client';

const meta: Meta = {
  title: '@grogqli/webapp e2e',
  component: App,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const apolloClient = createApolloClient();

const Template: Story<{}> = (args) => (
  <BrowserRouter>
    <App apolloClient={apolloClient} {...args} />
  </BrowserRouter>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
