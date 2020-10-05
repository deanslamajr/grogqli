import {MutationResolvers} from '@grogqli/schema';
import {createRecordingResolver} from './createRecording'

export const mutationResolver: MutationResolvers = {
  createRecording: createRecordingResolver
};
