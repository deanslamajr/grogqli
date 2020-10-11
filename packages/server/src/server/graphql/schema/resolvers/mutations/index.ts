import { MutationResolvers } from '@grogqli/schema';

import { createRecordingResolver } from './createRecording';
import { recordResponseResolver } from './recordResponse';

export const mutationResolver: MutationResolvers = {
  createRecording: createRecordingResolver,
  recordResponse: recordResponseResolver,
};
