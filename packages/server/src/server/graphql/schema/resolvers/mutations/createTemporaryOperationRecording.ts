import { MutationResolvers } from '@grogqli/schema';

import { persistTempSchemaRecording } from '../../../../files/schema';
import { create as createTempOpRecording } from '../../../../files/tempOpRecording';
import { pubSub } from '../pubSub';
import { TEMP_OP_RECORDING_SAVED } from '../subscriptions/temporaryOperationRecordingSavedResolver';

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

  const newTempOpRecording = await createTempOpRecording({
    operationName,
    query,
    variables,
    response: null,
    referrer,
    sessionId,
    tempSchemaRecordingId,
  });

  pubSub.publish(TEMP_OP_RECORDING_SAVED, {
    recordingSaved: newTempOpRecording,
  });

  return {
    newRecording: newTempOpRecording,
  };
};
