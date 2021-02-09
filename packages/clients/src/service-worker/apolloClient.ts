import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { context } from 'msw';

let client: ApolloClient<NormalizedCacheObject>;
let gqlServerPort = 4000;

type Create = (params: {
  port?: number;
}) => ApolloClient<NormalizedCacheObject>;

export const create: Create = ({ port }) => {
  gqlServerPort = port || gqlServerPort;

  const cache = new InMemoryCache();

  const grogqliPath = `http://localhost:${gqlServerPort}/grogqli`;
  const wsPath = `ws://localhost:${gqlServerPort}/grogqli`;

  const httpLink = createHttpLink({
    uri: ({ operationName }) => `${grogqliPath}/?swOp=${operationName}`,
    fetch: context.fetch as WindowOrWorkerGlobalScope['fetch'],
  });

  const wsLink = new WebSocketLink({
    uri: wsPath,
    options: {
      reconnect: true,
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    cache,
    link: splitLink,
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
};

export const get = () => {
  if (client === undefined) {
    client = create({});
  }

  return client;
};
