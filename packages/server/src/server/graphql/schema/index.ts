import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@grogqli/schema';

import { resolvers } from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
