import React from 'react';
import { Meta, Story } from '@storybook/react';
import { GetTempOpRecordings } from '@grogqli/schema';
import { action } from '@storybook/addon-actions';

import {
  SaveDrawer,
  SaveDrawerProps,
} from '../../../../../../../src/App/SessionsContainer/Session/RequestsPage/Transactions/SaveDrawer';
import mock from './SaveDrawer.mock.json';
import title from './title';

const meta: Meta = {
  title,
  component: SaveDrawer,
  args: {
    url: '/',
  },
  parameters: {
    grogqli: {
      workflowIds: ['requestPage:one', 'requestPage:two', 'requestPage:three'],
      defaultWorkflowId: 'requestPage:two',
    },
  },
};

export default meta;

const defaultProps: SaveDrawerProps = {
  handleClose: () => action('handleClose')(),
  isMutationLoading: false,
  onCreateWorkflow: async (values) => action('onCreateWorkflow')(values),
  tempOpRecordingsToSave: mock as GetTempOpRecordings.TemporaryOperationRecording[],
  show: true,
};

const Template: Story<SaveDrawerProps> = (args) => <SaveDrawer {...args} />;

export const Default: Story<SaveDrawerProps> = Template.bind({});
Default.args = { ...defaultProps };

export const MutationLoading: Story<SaveDrawerProps> = Template.bind({});
MutationLoading.args = { ...defaultProps, isMutationLoading: true };
