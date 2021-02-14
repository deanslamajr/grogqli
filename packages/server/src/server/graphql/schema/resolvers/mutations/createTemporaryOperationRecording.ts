import {
  MutationResolvers,
  TemporaryOperationRecording,
} from '@grogqli/schema';

import { create as createTempOpRecording } from '../../../../files/tempOpRecording';
import { pubSub } from '../pubSub';
import {
  TEMP_OP_RECORDING_SAVED,
  TempOpRecordingSavedPubSubPayload,
} from '../subscriptions/temporaryOperationRecordingSavedResolver';

export const resolver: MutationResolvers['createTemporaryOperationRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: {
      operationName,
      query,
      variables,
      schema: { hash: schemaHash, url: schemaUrl },
      sessionId,
      referrer,
    },
  } = args;

  const newTempOpRecordingFile = await createTempOpRecording({
    operationName,
    query,
    variables,
    response: null,
    referrer,
    sessionId,
    schemaHash,
    schemaUrl,
  });

  const newTempOpRecording: TemporaryOperationRecording = {
    id: newTempOpRecordingFile.id,
    operationName: newTempOpRecordingFile.operationName,
    sessionId: newTempOpRecordingFile.sessionId,
    query: newTempOpRecordingFile.query,
    variables: newTempOpRecordingFile.variables,
    response: newTempOpRecordingFile.response,
    schemaUrl,
    schemaHash,
    referrer: newTempOpRecordingFile.referrer,
  };

  const payload: TempOpRecordingSavedPubSubPayload = {
    temporaryOperationRecordingSaved: newTempOpRecording,
  };
  pubSub.publish(TEMP_OP_RECORDING_SAVED, payload);

  return {
    newRecording: newTempOpRecording,
  };
};
