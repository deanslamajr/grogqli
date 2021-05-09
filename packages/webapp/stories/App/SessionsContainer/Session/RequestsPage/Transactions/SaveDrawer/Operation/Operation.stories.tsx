import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  Operation,
  OperationProps,
} from '../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer/Operation';
import { OperationRecordingPlan } from '../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer/Operation/types';

import title from './title';

const meta: Meta = {
  title,
  component: Operation,
  excludeStories: /.*Plan$/,
};

export default meta;

const Template: Story<OperationProps> = (args) => <Operation {...args} />;

export const NoNesting: Story<OperationProps> = Template.bind({});
export const noNestingPlan: OperationRecordingPlan = {
  id: 'someId',
  query: 'query GetSomething {\n  isTaco }',
  schemaId: 'someSchemaId',
  name: 'GetSomething',
  rootTypeRecordingIds: ['someRootTypeRecordingId'],
  typeRecordings: {
    someRootTypeRecordingId: {
      typeName: 'Query',
      typeRecordingId: 'someRootTypeRecordingId',
      value: {
        isTaco: {
          type: 'value',
          value: true,
        },
      },
    },
  },
};
NoNesting.args = {
  plan: noNestingPlan,
};

export const SomeNesting: Story<OperationProps> = Template.bind({});
export const someNestingPlan: OperationRecordingPlan = {
  id: 'someId',
  query:
    'query GetSomething($thingId: String!) {\n  someThing(id: $thingId) {\n    isBurrito } __typename\n  }\n',
  schemaId: 'someSchemaId',
  name: 'GetSomething',
  rootTypeRecordingIds: ['someRootTypeRecordingId'],
  typeRecordings: {
    someRootTypeRecordingId: {
      typeName: 'Query',
      typeRecordingId: 'someRootTypeRecordingId',
      value: {
        someThing: {
          type: 'reference',
          value: {
            typeId: 'anotherTypeId',
            recordingId: 'anotherRecordingId',
          },
        },
      },
    },
    anotherRecordingId: {
      typeName: 'AnotherType',
      typeRecordingId: 'anotherRecordingId',
      value: {
        isBurrito: {
          type: 'value',
          value: false,
        },
      },
    },
  },
};
SomeNesting.args = {
  plan: someNestingPlan,
};
