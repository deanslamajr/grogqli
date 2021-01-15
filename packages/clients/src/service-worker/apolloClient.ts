import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { context } from 'msw';

import { serverUrl } from '../constants';

let client: ApolloClient<NormalizedCacheObject>;

export const create = (): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache();
  const link = createHttpLink({
    uri: `${serverUrl}/grogqli`,
    fetch: context.fetch as WindowOrWorkerGlobalScope['fetch'],
  });

  return new ApolloClient({
    cache,
    link,
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
