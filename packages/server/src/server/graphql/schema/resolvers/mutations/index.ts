import { MutationResolvers } from '@grogqli/schema';

import { createHandlerSessionResolver } from './createHandlerSession';
import { createRecordingResolver } from './createRecording';
import { createWorkflowResolver } from './createWorkflow';
import { recordResponseResolver } from './recordResponse';
import { playbackRecordingResolver } from './playbackRecording';

export const mutationResolver: MutationResolvers = {
  createHandlerSession: createHandlerSessionResolver,
  createRecording: createRecordingResolver,
  createWorkflow: createWorkflowResolver,
  playbackRecording: playbackRecordingResolver,
  recordResponse: recordResponseResolver,
};
