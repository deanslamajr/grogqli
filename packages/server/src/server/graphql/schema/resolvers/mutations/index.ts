import { MutationResolvers } from '@grogqli/schema';

import { createHandlerSessionResolver } from './createHandlerSession';
import { createSchemaRecordingResolver } from './createSchemaRecording';
import { resolver as createTemporaryOperationRecordingResolver } from './createTemporaryOperationRecording';
import { createWorkflowResolver } from './createWorkflow';
import { updateHandlerSessionResolver } from './updateHandlerSession';
import { updateTemporaryOperationRecordingResolver } from './updateTemporaryOperationRecording';
import { playbackRecordingResolver } from './playbackRecording';

export const mutationResolver: MutationResolvers = {
  createHandlerSession: createHandlerSessionResolver,
  createSchemaRecording: createSchemaRecordingResolver,
  createTemporaryOperationRecording: createTemporaryOperationRecordingResolver,
  createWorkflow: createWorkflowResolver,
  playbackRecording: playbackRecordingResolver,
  updateHandlerSession: updateHandlerSessionResolver,
  updateTemporaryOperationRecording: updateTemporaryOperationRecordingResolver,
};
