import { ApolloServer } from 'apollo-server-micro';
import schema from './schema';

export const apolloServer = new ApolloServer({
  schema,
});