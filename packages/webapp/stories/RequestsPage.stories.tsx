import React from 'react';
import { Meta, Story } from '@storybook/react';

import { SessionProvider } from '../src/App/SessionsContainer/SessionContext';
import { RequestsPage } from '../src/App/SessionsContainer/Session/RequestsPage';

const sessionId = 'someSessionId';

const meta: Meta = {
  title: 'RequestsPage',
  component: RequestsPage,
  args: {
    url: `/session/${sessionId}/requests`,
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

const Template: Story<{}> = () => <RequestsPage />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
