import { SubscriptionResolvers } from '@grogqli/schema';
import { recordingSavedResolver } from './recordingSavedResolver';

export const subscriptionResolver: SubscriptionResolvers = {
  recordingSaved: recordingSavedResolver,
};
