import { MutationResolvers, Recording } from '@grogqli/schema';
import gql from 'graphql-tag';
import { OperationDefinitionNode, FieldNode } from 'graphql';
import shortid from 'shortid';

import { getRecordingFile } from '../files';
import { pubSub } from '../pubSub';
import { RECORDING_SAVED } from '../subscriptions/recordingSavedResolver';

export const createRecordingResolver: MutationResolvers['createRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { operationName, query: _query, variables: _variables },
  } = args;
  const recordingId: string = shortid.generate();

  const newRecording: Recording = {
    id: recordingId,
    operationName,
    query: _query,
    variables: _variables,
    response: null,
  };

  const file = await getRecordingFile();
  file.set(recordingId, newRecording);
  file.save();

  pubSub.publish(RECORDING_SAVED, { recordingSaved: newRecording });

  return {
    newRecording,
  };
};
