import { MutationResolvers } from '@grogqli/schema';

import { createHandlerSessionResolver } from './createHandlerSession';
import { resolver as createTemporaryOperationRecordingResolver } from './createTemporaryOperationRecording';
import { createWorkflowResolver } from './createWorkflow';
import { updateTemporaryOperationRecordingResolver } from './updateTemporaryOperationRecording';
import { playbackRecordingResolver } from './playbackRecording';

export const mutationResolver: MutationResolvers = {
  createHandlerSession: createHandlerSessionResolver,
  createTemporaryOperationRecording: createTemporaryOperationRecordingResolver,
  createWorkflow: createWorkflowResolver,
  playbackRecording: playbackRecordingResolver,
  updateTemporaryOperationRecording: updateTemporaryOperationRecordingResolver,
};
