import React from 'react';
import { Meta, Story } from '@storybook/react';
import Transactions, {
  TransactionsProps,
} from '../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions';
import temporaryOperationRecordingsMock from '../SaveDrawer/SaveDrawer.mock.json';
import title from './title';

const meta: Meta = {
  title,
  component: Transactions,
  args: {
    subscribeToRecordings: () => {},
    toggleAllChecked: () => {},
    toggleCheck: () => {},
  },
};

export default meta;

const Template: Story<TransactionsProps> = (args) => <Transactions {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default: Story<TransactionsProps> = Template.bind({});

Default.args = {
  allAreChecked: true,
  checkedState: temporaryOperationRecordingsMock.reduce((state, mock) => {
    state[mock.id] = true;
    return state;
  }, {}),
  temporaryOperationRecordings: temporaryOperationRecordingsMock,
  loading: false,
};
