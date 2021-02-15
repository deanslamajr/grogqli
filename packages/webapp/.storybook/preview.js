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

let sessionId;

export const loaders = [
  async () => {
    if (!sessionId) {
      const { HandlerState: Modes } = require('@grogqli/schema');
      const { mountClient, startServiceWorker } = require('@grogqli/clients');

      // port that @grogqli/server's dev server is normally set to
      const port = 1234;

      sessionId = await startServiceWorker({
        initialMode: Modes.Playback,
        initialWorkflowId: 'fETBrnUgT6D',
        port,
      });

      console.log(
        '@grogqli/webapp > new grogqli handler session created, id:',
        sessionId
      );

      // mountClient({
      //   initialSessionId: sessionId,
      //   port,
      // });
    }
  },
];
