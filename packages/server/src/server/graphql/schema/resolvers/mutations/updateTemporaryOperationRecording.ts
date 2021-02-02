import {
  MutationResolvers,
  TemporaryOperationRecording,
} from '@grogqli/schema';

import { update as updateTempOpRecording } from '../../../../files/tempOpRecording';
import { pubSub } from '../pubSub';
import { TEMP_OP_RECORDING_SAVED } from '../subscriptions/temporaryOperationRecordingSavedResolver';

export const updateTemporaryOperationRecordingResolver: MutationResolvers['updateTemporaryOperationRecording'] = async (
  _parent,
  args,
  _context,
  _info
) => {
  const {
    input: { response, sessionId, tempOpRecordingId },
  } = args;
  const updatedTempOpRecording: TemporaryOperationRecording = await updateTempOpRecording(
    {
      response,
      sessionId,
      tempOpRecordingId,
    }
  );

  pubSub.publish(TEMP_OP_RECORDING_SAVED, {
    recordingSaved: updatedTempOpRecording,
  });

  return {
    updatedRecording: updatedTempOpRecording,
  };
};
