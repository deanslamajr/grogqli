import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RequestsPage } from '../../../../../src/App/SessionsContainer/Session/RequestsPage';
import { sessionId } from '../../../../constants.json';
import title from './title';

const meta: Meta = {
  title,
  component: RequestsPage,
  args: {
    url: `/session/${sessionId}/requests`,
  },
  parameters: {
    grogqli: {
      workflowIds: ['requestPage:one', 'requestPage:two', 'requestPage:three'],
      defaultWorkflowId: 'requestPage:two',
    },
  },
};

export default meta;

const Template: Story<{}> = () => <RequestsPage />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
