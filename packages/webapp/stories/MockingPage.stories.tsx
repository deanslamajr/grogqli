import React from 'react';
import { Meta, Story } from '@storybook/react';

import { SessionProvider } from '../src/App/SessionsContainer/SessionContext';
import { MockingPage } from '../src/App/SessionsContainer/Session/MockingPage';

const sessionId = 'someSessionId';

const meta: Meta = {
  title: 'MockingPage',
  component: MockingPage,
  args: {
    url: `/session/${sessionId}/mocking`,
  },
  decorators: [
    (Story) => (
      <SessionProvider sessionId={sessionId}>
        <Story />
      </SessionProvider>
    ),
  ],
};

export default meta;

const Template: Story<{}> = () => <MockingPage />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
