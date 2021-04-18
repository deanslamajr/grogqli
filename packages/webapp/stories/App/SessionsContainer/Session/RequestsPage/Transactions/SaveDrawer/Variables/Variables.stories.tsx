import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Variables,
  VariablesProps,
} from '../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer/Variables';
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

export const SingleObject: Story<VariablesProps> = Template.bind({});
SingleObject.args = {
  onUpdate: (payload) => console.log('onUpdate invoked! payload', payload),
  variablesString: JSON.stringify({
    someArg: {
      stringField: '',
      numberField: 1234,
      booleanField: true,
    },
  }),
};

export const SeveralObjects: Story<VariablesProps> = Template.bind({});
SeveralObjects.args = {
  onUpdate: (payload) => console.log('onUpdate invoked! payload', payload),
  variablesString: JSON.stringify({
    someArg: {
      stringField: '',
      numberField: 1234,
      booleanField: true,
    },
    anotherArg: {
      anotherStringField: '',
      anotherNumberField: 1234,
      objectField: {
        booleanField: true,
      },
    },
  }),
};
