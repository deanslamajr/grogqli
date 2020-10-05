import {MutationResolvers} from '@grogqli/schema';

export const createRecordingResolver: MutationResolvers['createRecording'] = async (_parent, _args, context, _info) => {
  console.log('inside resolver!')
  return {
    newRecording: {
      operationName: 'replace',
      query: 'with',
      variables: 'real values'
    }
  }
};
