import { SubscriptionResolvers } from '@grogqli/schema';

import { handlerSessionCreatedResolver } from './handlerSessionCreatedResolver';
import { handlerStateChangedResolver } from './handlerStateChangedResolver';
import { recordingSavedResolver } from './recordingSavedResolver';

export const subscriptionResolver: SubscriptionResolvers = {
  handlerSessionCreated: handlerSessionCreatedResolver,
  handlerStateChanged: handlerStateChangedResolver,
  recordingSaved: recordingSavedResolver,
};
