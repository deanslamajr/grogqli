import React from 'react';
import { Meta, Story } from '@storybook/react';

import { App } from '../src';
import { createApolloClient } from './apollo-client';

const meta: Meta = {
  title: 'App',
  component: App,
  args: {
    url: '/?s=taco',
  },
};

export default meta;

const apolloClient = createApolloClient();

const Template: Story<{}> = () => <App apolloClient={apolloClient} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
