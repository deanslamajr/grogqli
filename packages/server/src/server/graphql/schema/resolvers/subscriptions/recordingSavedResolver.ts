import {SubscriptionResolvers} from '@grogqli/schema';
import { pubSub} from '../pubSub';

export const RECORDING_SAVED = 'RECORDING_SAVED';

export const recordingSavedResolver: SubscriptionResolvers['recordingSaved'] = {
  subscribe: () => {
    return pubSub.asyncIterator(RECORDING_SAVED);
  }
};
