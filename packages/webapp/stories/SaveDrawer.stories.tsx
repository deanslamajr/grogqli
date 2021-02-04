import React from 'react';
import { Meta, Story } from '@storybook/react';
import { GetTempOpRecordings } from '@grogqli/schema';

import {
  SaveDrawer,
  SaveDrawerProps,
} from '../src/App/SessionsContainer/Session/RequestsPage/SaveDrawer';

import mock from './SaveDrawer.mock.json';

const meta: Meta = {
  title: 'SaveDrawer',
  component: SaveDrawer,
  args: {
    url: '/',
  },
};

export default meta;

const defaultProps: SaveDrawerProps = {
  handleClose: () => console.log('handleClose'),
  tempOpRecordingsToSave: mock as GetTempOpRecordings.TemporaryOperationRecording[],
  show: true,
};

const Template: Story<{}> = () => <SaveDrawer {...defaultProps} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
