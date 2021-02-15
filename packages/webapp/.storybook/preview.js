import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { createApolloClient } from '../stories/apollo-client';

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
              <Story />
            </Providers>
          </>
        )}
      />
    </MemoryRouter>
  ),
];

// Storybook executes this module in both bootstap phase (Node)
// and a story's runtime (browser). However, we cannot call `setupWorker`
// in Node environment, so need to check if we're in a browser.
if (typeof window !== 'undefined') {
  // from dev server running in @grogqli/server
  // TODO replace use of dev server
  const { port } = require('../grogqli.json');

  const { mountClient, startServiceWorker } = require('@grogqli/clients');
  startServiceWorker({ port }).then((sessionId) => {
    console.log(
      '@grogqli/webapp > new grogqli handler session created, id:',
      sessionId
    );
    mountClient({
      initialSessionId: sessionId,
      port,
    });
  });
}
