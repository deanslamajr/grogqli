import React from 'react';
import { ApolloProvider } from '@apollo/client';

import { client } from './apolloClient';
import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    grogqli: {
      workflowIds: ['one', 'two', 'three'],
      defaultWorkflowId: 'one',
    },
  },
  decorators: [
    (Story) => (
      <ApolloProvider client={client}>
        <Story />
      </ApolloProvider>
    ),
  ],
};

const Template = (args) => <Button {...args}>Label</Button>;

export const All = () => <Button>Normal</Button>;

export const Default = Template.bind({});

export const Hover = Template.bind({});
Hover.args = { pseudo: { hover: true } };

export const Focus = Template.bind({});
Focus.args = { pseudo: { focus: true } };

export const Active = Template.bind({});
Active.args = { pseudo: { active: true } };
