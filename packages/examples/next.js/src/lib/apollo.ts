import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { version } from '../../package.json';

export const LOCAL_GQL_KEY = 'LOCAL_GQL_KEY';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const graphbrainzHttpLink = createHttpLink({
  uri: 'https://graphbrainz.herokuapp.com/',
});

const localHttpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

// https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting#Provide_meaningful_User-Agent_strings
const appContactHeader = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'X-User-Agent': `Grogqli/${version} ( https://github.com/deanslamajr/grogqli/issues )`,
    },
  };
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === LOCAL_GQL_KEY,
      localHttpLink,
      appContactHeader.concat(graphbrainzHttpLink)
    ),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
