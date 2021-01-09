import { MutationResolvers } from '@grogqli/schema';

import { createRecordingResolver } from './createRecording';
import { createWorkflowResolver } from './createWorkflow';
import { recordResponseResolver } from './recordResponse';

export const mutationResolver: MutationResolvers = {
  createRecording: createRecordingResolver,
  createWorkflow: createWorkflowResolver,
  recordResponse: recordResponseResolver,
};
