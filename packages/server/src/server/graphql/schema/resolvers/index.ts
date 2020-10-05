import {Resolvers} from '@grogqli/schema';

import { queryResolver } from './queries';
import {mutationResolver } from './mutations'

export const resolvers: Partial<Resolvers> = {
  Query: queryResolver,
  Mutation: mutationResolver
};
