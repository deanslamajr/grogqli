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

import { serverUrl } from '../constants';

let client: ApolloClient<NormalizedCacheObject>;

export const create = (): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `http://${serverUrl}/grogqli`,
    fetch: context.fetch as WindowOrWorkerGlobalScope['fetch'],
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${serverUrl}/graphql`,
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
    client = create();
  }

  return client;
};
