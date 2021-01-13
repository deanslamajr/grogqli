import { MutationResolvers } from '@grogqli/schema';

import { createRecordingResolver } from './createRecording';
import { createWorkflowResolver } from './createWorkflow';
import { recordResponseResolver } from './recordResponse';
import { playbackRecordingResolver } from './playbackRecording';

export const mutationResolver: MutationResolvers = {
  createRecording: createRecordingResolver,
  createWorkflow: createWorkflowResolver,
  playbackRecording: playbackRecordingResolver,
  recordResponse: recordResponseResolver,
};
