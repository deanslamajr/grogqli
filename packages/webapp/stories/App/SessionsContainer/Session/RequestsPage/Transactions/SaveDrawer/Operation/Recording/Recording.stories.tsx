import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Recording,
  RecordingProps,
} from '../../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer/Operation/Recording';
import { noNestingPlan, someNestingPlan } from '../Operation.stories';
import title from './title';

const meta: Meta = {
  title,
  component: Recording,
};

export default meta;

const Template: Story<RecordingProps> = (args) => <Recording {...args} />;

export const NoNesting: Story<RecordingProps> = Template.bind({});
NoNesting.args = {
  rootTypeRecordingIds: noNestingPlan.rootTypeRecordingIds,
  typeRecordings: noNestingPlan.typeRecordings,
};

export const SomeNesting: Story<RecordingProps> = Template.bind({});
SomeNesting.args = {
  rootTypeRecordingIds: someNestingPlan.rootTypeRecordingIds,
  typeRecordings: someNestingPlan.typeRecordings,
};
