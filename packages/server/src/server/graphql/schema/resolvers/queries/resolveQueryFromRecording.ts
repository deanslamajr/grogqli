import { ApolloServerBase } from 'apollo-server-core';

export const resolver = async () => {
  const config = {};
  const apolloServer = new ApolloServerBase(config);
  const response = await apolloServer.executeOperation();
  return response;
};
