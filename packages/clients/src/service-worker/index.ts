import { setupWorker } from 'msw';
import { CreateHandlerSession, OnHandlerStateChange } from '@grogqli/schema';

import { create as createApolloClient } from './apolloClient';

type StartServiceWorker = (params: { port: number }) => Promise<string>;

export const startServiceWorker: StartServiceWorker = async ({ port }) => {
  const apolloClient = createApolloClient({ port });

  const { /*getPlaybackHandlers*/ getRecordingHandlers } = await import(
    './webHandlers'
  );
  const worker = setupWorker(...getRecordingHandlers());
  worker.start();

  console.log('document.title', document.title);
  const name = document.title;

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
