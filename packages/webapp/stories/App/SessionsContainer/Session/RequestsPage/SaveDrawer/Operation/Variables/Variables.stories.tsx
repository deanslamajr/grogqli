import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Variables,
  VariablesProps,
} from '../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/SaveDrawer/Operation/Variables';
import title from './title';

const meta: Meta = {
  title,
  component: Variables,
};

export default meta;

const Template: Story<VariablesProps> = (args) => <Variables {...args} />;

export const SinglePrimitive: Story<VariablesProps> = Template.bind({});
SinglePrimitive.args = {
  onUpdate: (payload) => console.log('onUpdate invoked! payload', payload),
  variablesString: JSON.stringify({
    someArg: 10,
  }),
};
