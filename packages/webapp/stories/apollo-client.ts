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

// same port that the grogqli data in @grogqli/server is associated
// TODO add webapp functionality to set the target schema for playback
// const port = 5678;
const port = 1234;
const grogqliPath = `http://localhost:${port}/grogqli`;
const grogqliWsPath = `ws://localhost:${port}/grogqli`;

const httpLink = new HttpLink({
  uri: grogqliPath,
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri: grogqliWsPath,
  options: {
    reconnect: false,
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
