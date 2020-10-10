import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { onError } from '@apollo/client/link/error';

import App from './App';

import {createApolloClient} from './createApolloClient';
import { HttpLink, from, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const grogqliPath = 'http://localhost:4000/grogqli';
const grogqliWsPath = 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: grogqliPath,
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri: grogqliWsPath,
  options: {
    reconnect: true
  }
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
  httpLink,
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

const apolloClient = createApolloClient({ link });

hydrate(
  <BrowserRouter>
    <App apolloClient={apolloClient}/>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
