import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import { grogqliPath } from '../../shared/constants';

export const apolloServer = new ApolloServer({
  schema,
  uploads: false,
  subscriptions: grogqliPath,
});
