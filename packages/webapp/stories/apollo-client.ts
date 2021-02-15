import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';

import { port } from '../grogqli.json';

const grogqliPath = `http://localhost:${port}/grogqli`;
const grogqliWsPath = `ws://localhost:${port}/grogqli`;

const httpLink = new HttpLink({
  uri: grogqliPath,
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri: grogqliWsPath,
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([errorLink, splitLink]);

export const createApolloClient = () => {
  const cache = new InMemoryCache();

  return new ApolloClient({
    link,
    cache,
  });
};
