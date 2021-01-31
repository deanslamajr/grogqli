import { SubscriptionResolvers } from '@grogqli/schema';
import { pubSub } from '../pubSub';

export const TEMP_OP_RECORDING_SAVED = 'TEMP_OP_RECORDING_SAVED';

export const recordingSavedResolver: SubscriptionResolvers['temporaryOperationRecordingSaved'] = {
  subscribe: () => {
    return pubSub.asyncIterator(TEMP_OP_RECORDING_SAVED);
  },
};
