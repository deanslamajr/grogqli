import { SubscriptionResolvers } from '@grogqli/schema';
import { pubSub } from '../pubSub';

export const HANDLER_STATE_CHANGED = 'HANDLER_STATE_CHANGED';

export const handlerStateChangedResolver: SubscriptionResolvers['handlerStateChanged'] = {
  subscribe: () => {
    return pubSub.asyncIterator(HANDLER_STATE_CHANGED);
  },
};
