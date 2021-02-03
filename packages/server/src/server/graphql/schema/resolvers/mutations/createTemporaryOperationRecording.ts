import {
  MutationResolvers,
  TemporaryOperationRecording,
} from '@grogqli/schema';

import { persistTempSchemaRecording } from '../../../../files/schema';
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
    input: { operationName, query, variables, schema, sessionId, referrer },
  } = args;
  let tempSchemaRecordingId;
  if (schema.content) {
    tempSchemaRecordingId = await persistTempSchemaRecording({
      schema: schema.content,
      sessionId,
      url: schema.url,
    });
  }

  const newTempOpRecordingFile = await createTempOpRecording({
    operationName,
    query,
    variables,
    response: null,
    referrer,
    sessionId,
    tempSchemaRecordingId,
  });

  const newTempOpRecording: TemporaryOperationRecording = {
    id: newTempOpRecordingFile.id,
    operationName: newTempOpRecordingFile.operationName,
    sessionId: newTempOpRecordingFile.sessionId,
    query: newTempOpRecordingFile.query,
    variables: newTempOpRecordingFile.variables,
    response: newTempOpRecordingFile.response,
    tempSchemaRecordingId: newTempOpRecordingFile.tempSchemaRecordingId,
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
