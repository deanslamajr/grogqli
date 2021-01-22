import { SubscriptionResolvers } from '@grogqli/schema';
import { pubSub } from '../pubSub';

export const HANDLER_SESSION_CREATED = 'HANDLER_SESSION_CREATED';

export const handlerSessionCreatedResolver: SubscriptionResolvers['handlerSessionCreated'] = {
  subscribe: () => {
    return pubSub.asyncIterator(HANDLER_SESSION_CREATED);
  },
};
