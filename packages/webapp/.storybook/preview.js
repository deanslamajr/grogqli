import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { createApolloClient } from '../stories/apollo-client';
import { sessionId } from '../stories/constants.json';

import { SessionProvider } from '../src/App/SessionsContainer/SessionContext';

import { Providers } from '../src/App/Providers';
import { cssTheme } from '../src/App/constants';

const apolloClient = createApolloClient();

export const decorators = [
  (Story, { args: { url } }) => (
    <MemoryRouter initialEntries={[url]}>
      <Route
        render={({ location }) => (
          <>
            <div>{`${location.pathname}${location.search}`}</div>
            <Providers apolloClient={apolloClient} cssTheme={cssTheme}>
              <SessionProvider sessionId={sessionId}>
                <Story />
              </SessionProvider>
            </Providers>
          </>
        )}
      />
    </MemoryRouter>
  ),
];
