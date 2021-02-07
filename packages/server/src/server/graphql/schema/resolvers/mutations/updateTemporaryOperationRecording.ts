import {
  MutationResolvers,
  TemporaryOperationRecording,
} from '@grogqli/schema';

import { update as updateTempOpRecording } from '../../../../files/tempOpRecording';
import { pubSub } from '../pubSub';
import {
  TEMP_OP_RECORDING_SAVED,
  TempOpRecordingSavedPubSubPayload,
} from '../subscriptions/temporaryOperationRecordingSavedResolver';

export const updateTemporaryOperationRecordingResolver: MutationResolvers['updateTemporaryOperationRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { response, sessionId, tempOpRecordingId },
  } = args;
  const updatedTempOpRecordingFile = await updateTempOpRecording({
    response,
    sessionId,
    tempOpRecordingId,
  });

  const updatedTempOpRecording: TemporaryOperationRecording = {
    id: updatedTempOpRecordingFile.id,
    operationName: updatedTempOpRecordingFile.operationName,
    sessionId: updatedTempOpRecordingFile.sessionId,
    query: updatedTempOpRecordingFile.query,
    variables: updatedTempOpRecordingFile.variables,
    response: updatedTempOpRecordingFile.response,
    schemaHash: updatedTempOpRecordingFile.schemaHash,
    schemaUrl: updatedTempOpRecordingFile.schemaUrl,
    referrer: updatedTempOpRecordingFile.referrer,
  };

  const payload: TempOpRecordingSavedPubSubPayload = {
    temporaryOperationRecordingSaved: updatedTempOpRecording,
  };
  pubSub.publish(TEMP_OP_RECORDING_SAVED, payload);

  return {
    updatedRecording: updatedTempOpRecording,
  };
};
