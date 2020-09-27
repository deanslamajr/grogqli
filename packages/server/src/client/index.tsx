import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { onError } from '@apollo/client/link/error';

import App from './App';

import {createApolloClient} from './createApolloClient';
import { HttpLink, from } from '@apollo/client';

const grogqliPath = '/grogqli';

const httpLink = new HttpLink({
  uri: grogqliPath,
  credentials: 'same-origin',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([errorLink, httpLink]);

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
