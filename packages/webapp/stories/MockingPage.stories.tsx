import React from 'react';
import { Meta, Story } from '@storybook/react';

import { sessionId } from './constants.json';

import { MockingPage } from '../src/App/SessionsContainer/Session/MockingPage';

const meta: Meta = {
  title: 'MockingPage',
  component: MockingPage,
  args: {
    url: `/session/${sessionId}/mocking`,
  },
  parameters: {
    grogqli: {
      workflowIds: [
        'mockingPage:someWorkflowId',
        'mockingPage:anotherWorkflowId',
        'three',
      ],
      defaultWorkflowId: 'mockingPage:someWorkflowId',
    },
  },
};

export default meta;

const Template: Story<{}> = () => <MockingPage />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
