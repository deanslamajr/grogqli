import { setupWorker } from 'msw';
import { CreateHandlerSession, OnHandlerStateChange } from '@grogqli/schema';
import shortId from 'shortid';

import { create as createApolloClient } from './apolloClient';
import { initialize as initializeState } from './handlerState';

type StartServiceWorker = (params: {
  name?: string;
  port: number;
}) => Promise<string>;

export const startServiceWorker: StartServiceWorker = async ({
  name = shortId.generate(),
  port,
}) => {
  const apolloClient = createApolloClient({ port });

  const { /*getPlaybackHandlers*/ getRecordingHandlers } = await import(
    './webHandlers'
  );
  const worker = setupWorker(...getRecordingHandlers());
  worker.start();

  const { data, errors } = await apolloClient.mutate({
    mutation: CreateHandlerSession.CreateHandlerSessionDocument,
    variables: {
      input: {
        name,
      },
    },
  });

  if (errors && errors.length) {
    // TODO better error handling
    throw errors[0];
  }
  if (!data) {
    throw new Error('Mutation response did not return handler session id!');
  }

  const handlerSessionId = data.createHandlerSession.newHandler.id;
  initializeState({ sessionId: handlerSessionId });

  apolloClient
    .subscribe({
      query: OnHandlerStateChange.OnHandlerStateChangeDocument,
      variables: {
        input: {
          id: handlerSessionId,
        },
      },
    })
    .subscribe({
      next({ data, errors }) {
        console.log('onHandlerStateChange data:', { data, errors });

        if (errors && errors.length) {
          // TODO better error handling
          throw errors[0];
        }
        if (!data) {
          throw new Error('onHandlerStateChange didnt return expected data!');
        }

        // const newState = data.handlerStateChanged.currentState

        // if (newState === 'RECORDING') {
        //   worker.resetHandlers(...getRecordingHandlers())
        // }

        // if (newState === 'PLAYBACK') {
        //   worker.resetHandlers(...getPlaybackHandlers())
        // }

        // if (newState === 'PASSTHROUGH') {
        //   const passthroughHandlers = getPassthroughHandlers()
        //   worker.resetHandlers(...passthroughHandlers)
        // }
      },
      error(error) {
        throw error;
      },
    });

  return handlerSessionId;
};
