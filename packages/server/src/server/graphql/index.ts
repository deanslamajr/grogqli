import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema/types';
import {resolvers} from './schema/resolvers';

export const apolloServer = new ApolloServer({ typeDefs, resolvers, uploads: false });
