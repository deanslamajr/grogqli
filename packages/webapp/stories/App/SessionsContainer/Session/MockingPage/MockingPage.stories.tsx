import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MockingPage } from '../../../../../src/App/SessionsContainer/Session/MockingPage';
import { sessionId } from '../../../../constants.json';
import title from './title';

const meta: Meta = {
  title,
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
