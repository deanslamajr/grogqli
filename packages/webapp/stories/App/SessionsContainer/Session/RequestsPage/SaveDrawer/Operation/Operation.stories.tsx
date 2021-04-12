import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Operation,
  OperationProps,
} from '../../../../../../../src/App/SessionsContainer/Session/RequestsPage/SaveDrawer/Operation';
import mocks from '../SaveDrawer.mock.json';
import title from './title';

const meta: Meta = {
  title,
  component: Operation,
};

export default meta;

const Template: Story<OperationProps> = (args) => <Operation {...args} />;

export const Default: Story<OperationProps> = Template.bind({});
Default.args = {
  operationName: mocks[0].operationName,
  query: mocks[0].query,
  recordingId: 'someId',
  response: mocks[0].response,
  variablesString: mocks[0].variables,
};
