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

let handlerSessionId;

export const loaders = [
  async () => {
    if (!handlerSessionId) {
      const { HandlerState: Modes } = require('@grogqli/schema');
      const { mountClient, startServiceWorker } = require('@grogqli/clients');

      // port that @grogqli/server's dev server is normally set to
      const { port } = require('../grogqli.json');

      handlerSessionId = await startServiceWorker({
        initialMode: Modes.Playback,
        initialWorkflowId: '8h9kLygAkmQ',
        port,
      });

      console.log(
        '@grogqli/webapp > new grogqli handler session created, id:',
        handlerSessionId
      );

      // mountClient({
      //   initialSessionId: sessionId,
      //   port,
      // });
    }
  },
];
