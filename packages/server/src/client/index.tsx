import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { onError } from '@apollo/client/link/error';

import { App } from '@grogqli/webapp';

import { HttpLink, from, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

import { createApolloClient } from '../shared/createApolloClient';

declare global {
  interface Window {
    __APOLLO_STATE__: any;
    __PORT__: number;
    __SHOULD_DOGFOOD__: boolean;
  }
}

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined' && window.__SHOULD_DOGFOOD__) {
    const gqlServerPort = 1234;

    // prevent infinite grogqli inspection!
    // eslint-disable-next-line no-restricted-globals
    const currentPagesPort = parseInt(location.port);
    if (currentPagesPort !== gqlServerPort) {
      const { mountClient, startServiceWorker } = require('@grogqli/clients');
      startServiceWorker({ port: gqlServerPort }).then((sessionId) => {
        console.log(
          '@grogqli/server > new grogqli handler session created, id:',
          sessionId
        );
        mountClient({
          initialSessionId: sessionId,
          port: gqlServerPort,
        });
      });
    }
  }
}

const port = window.__PORT__;

const grogqliPath = `http://localhost:${port}/grogqli`;
const grogqliWsPath = `ws://localhost:${port}/grogqli`;

const httpLink = new HttpLink({
  uri: ({ operationName }) => `${grogqliPath}/?waOp=${operationName}`,
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

const apolloClient = createApolloClient({
  link,
  initialState: window.__APOLLO_STATE__,
});

hydrate(
  <BrowserRouter>
    <App apolloClient={apolloClient} />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
