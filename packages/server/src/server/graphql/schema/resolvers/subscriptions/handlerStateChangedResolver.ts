import {
  Handler,
  SubscriptionResolvers,
  SubscriptionHandlerStateChangedArgs,
} from '@grogqli/schema';
import { withFilter } from 'apollo-server-express';
import { pubSub } from '../pubSub';

export const HANDLER_STATE_CHANGED = 'HANDLER_STATE_CHANGED';

export interface HandlerStateChangedPubSubPayload {
  handlerStateChanged: Handler;
}

export const handlerStateChangedResolver: SubscriptionResolvers['handlerStateChanged'] = {
  subscribe: withFilter(
    () => pubSub.asyncIterator(HANDLER_STATE_CHANGED),
    (
      payload: HandlerStateChangedPubSubPayload,
      args: SubscriptionHandlerStateChangedArgs
    ) => {
      return payload.handlerStateChanged.id === args.input.id;
    }
  ),
};
