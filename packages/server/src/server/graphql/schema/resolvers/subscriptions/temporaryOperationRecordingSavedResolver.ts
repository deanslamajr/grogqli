import {
  SubscriptionResolvers,
  SubscriptionTemporaryOperationRecordingSavedArgs,
  TemporaryOperationRecording,
} from '@grogqli/schema';
import { withFilter } from 'apollo-server-express';
import { pubSub } from '../pubSub';

export const TEMP_OP_RECORDING_SAVED = 'TEMP_OP_RECORDING_SAVED';

export interface TempOpRecordingSavedPubSubPayload {
  temporaryOperationRecordingSaved: TemporaryOperationRecording;
}

export const temporaryOperationRecordingSavedResolver: SubscriptionResolvers['temporaryOperationRecordingSaved'] = {
  subscribe: withFilter(
    () => pubSub.asyncIterator(TEMP_OP_RECORDING_SAVED),
    (
      payload: TempOpRecordingSavedPubSubPayload,
      args: SubscriptionTemporaryOperationRecordingSavedArgs
    ) => {
      return (
        payload.temporaryOperationRecordingSaved.sessionId ===
        args.input.sessionId
      );
    }
  ),
};
