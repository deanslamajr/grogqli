import { Resolvers } from '@grogqli/schema';

import { queryResolver } from './queries';
import { mutationResolver } from './mutations';
import { subscriptionResolver } from './subscriptions';
import scalarsResolvers from './scalars';

export const resolvers: Partial<Resolvers> = {
  Query: queryResolver,
  Mutation: mutationResolver,
  Subscription: subscriptionResolver,
  ...scalarsResolvers,
};
