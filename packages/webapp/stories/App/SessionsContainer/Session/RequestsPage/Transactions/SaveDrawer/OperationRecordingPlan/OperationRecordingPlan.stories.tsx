import React from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import {
  OperationRecordingPlan,
  OperationRecordingPlanProps,
} from '../../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer/OperationRecordingPlan';
import title from './title';

const meta: Meta = {
  title,
  component: OperationRecordingPlan,
  parameters: {
    grogqli: {
      workflowIds: ['requestPage:one', 'requestPage:two', 'requestPage:three'],
      defaultWorkflowId: 'requestPage:two',
    },
  },
};

export default meta;

const rootTypeRecording: OperationRecordingPlanProps['typeRecordings'][number] = {
  typeName: 'Query',
  typeRecordingId: 'someRootTypeRecordingId',
  refs: [],
  values: [],
};

const defaultProps: OperationRecordingPlanProps = {
  opName: 'GetSomething',
  rootTypeRecordingId: 'someRootTypeRecordingId',
  typeRecordings: [rootTypeRecording],
};

const defaultValues = [
  {
    fieldName: 'someBoolean',
    value: true,
  },
  {
    fieldName: 'someNumber',
    value: 123456,
  },
  {
    fieldName: 'someString',
    value: 'Hello World',
  },
  {
    fieldName: 'someArray',
    value: ['a', 'list', 'of', 'strings'],
  },
];

const Template: Story<OperationRecordingPlanProps> = (args) => (
  <OperationRecordingPlan {...args} />
);

export const NoRootTypeMatch: Story<OperationRecordingPlanProps> = Template.bind(
  {}
);
NoRootTypeMatch.args = {
  ...defaultProps,
  rootTypeRecordingId: 'thisIdWontMatch',
};

export const NoNestedTypeMatch: Story<OperationRecordingPlanProps> = Template.bind(
  {}
);
NoNestedTypeMatch.args = {
  ...defaultProps,
  typeRecordings: [
    {
      ...rootTypeRecording,
      refs: [
        {
          fieldName: 'fieldWithInvalidRef',
          typeRecordingIds: ['invalidTypeRecordingId'],
        },
      ],
    },
  ],
};

export const RootValues: Story<OperationRecordingPlanProps> = Template.bind({});
RootValues.args = {
  ...defaultProps,
  typeRecordings: [
    {
      ...rootTypeRecording,
      refs: [],
      values: defaultValues,
    },
  ],
};

export const BasicNested: Story<OperationRecordingPlanProps> = Template.bind(
  {}
);
BasicNested.args = {
  ...defaultProps,
  typeRecordings: [
    {
      ...rootTypeRecording,
      refs: [
        {
          fieldName: 'someNestedType',
          typeRecordingIds: ['someTypeRecordingId'],
        },
      ],
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'someTypeRecordingId',
      refs: [],
      values: defaultValues,
    },
  ],
};

export const DeepNested: Story<OperationRecordingPlanProps> = Template.bind({});
DeepNested.args = {
  ...defaultProps,
  typeRecordings: [
    {
      ...rootTypeRecording,
      refs: [
        {
          fieldName: 'someNestedType',
          typeRecordingIds: ['someTypeRecordingId'],
        },
        {
          fieldName: 'anotherNestedType',
          typeRecordingIds: ['anotherTypeRecordingId'],
        },
        {
          fieldName: 'yetAnotherNestedType',
          typeRecordingIds: ['yetAnotherTypeRecordingId'],
        },
      ],
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'someTypeRecordingId',
      refs: [],
      values: defaultValues,
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'anotherTypeRecordingId',
      refs: [
        {
          fieldName: 'secondNestedType',
          typeRecordingIds: ['secondTypeRecordingId'],
        },
      ],
      values: defaultValues,
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'yetAnotherTypeRecordingId',
      refs: [],
      values: defaultValues,
    },
    {
      typeName: 'NestedType2',
      typeRecordingId: 'secondTypeRecordingId',
      refs: [],
      values: defaultValues,
    },
  ],
};

export const ObjectArray: Story<OperationRecordingPlanProps> = Template.bind(
  {}
);
ObjectArray.args = {
  ...defaultProps,
  typeRecordings: [
    {
      ...rootTypeRecording,
      refs: [
        {
          fieldName: 'someNestedType',
          typeRecordingIds: [
            'someTypeRecordingId',
            'anotherTypeRecordingId',
            'yetAnotherTypeRecordingId',
          ],
        },
      ],
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'someTypeRecordingId',
      refs: [],
      values: [
        {
          fieldName: 'numberField',
          value: 1,
        },
        {
          fieldName: 'stringField',
          value: 'hi',
        },
        {
          fieldName: 'booleanField',
          value: true,
        },
      ],
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'anotherTypeRecordingId',
      refs: [],
      values: [
        {
          fieldName: 'numberField',
          value: 2,
        },
        {
          fieldName: 'stringField',
          value: 'hello',
        },
        {
          fieldName: 'booleanField',
          value: false,
        },
      ],
    },
    {
      typeName: 'SomeType',
      typeRecordingId: 'yetAnotherTypeRecordingId',
      refs: [],
      values: [
        {
          fieldName: 'numberField',
          value: 3,
        },
        {
          fieldName: 'stringField',
          value: 'goodbye',
        },
        {
          fieldName: 'booleanField',
          value: true,
        },
      ],
    },
  ],
};
