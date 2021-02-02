import { SubscriptionResolvers } from '@grogqli/schema';

import { handlerSessionCreatedResolver } from './handlerSessionCreatedResolver';
import { handlerStateChangedResolver } from './handlerStateChangedResolver';
import { temporaryOperationRecordingSavedResolver } from './temporaryOperationRecordingSavedResolver';

export const subscriptionResolver: SubscriptionResolvers = {
  handlerSessionCreated: handlerSessionCreatedResolver,
  handlerStateChanged: handlerStateChangedResolver,
  temporaryOperationRecordingSaved: temporaryOperationRecordingSavedResolver,
};
