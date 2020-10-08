import { typeDefs as sharedTypes } from './shared';
import { typeDefs as queryTypes } from './queries';
import { typeDefs as mutationTypes } from './mutations';
import { typeDefs as subscriptionTypes } from './subscriptions';

export const typeDefs = [
  ...queryTypes,
  ...mutationTypes,
  ...sharedTypes,
  ...subscriptionTypes
];
