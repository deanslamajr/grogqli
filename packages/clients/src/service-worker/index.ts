import { setupWorker } from 'msw';
import { CreateHandlerSession, OnHandlerStateChange } from '@grogqli/schema';

import { get as createApolloClient } from './apolloClient';
import { getPlaybackHandlers /*getRecordingHandlers*/ } from './webHandlers';

const generateSessionName = () => {
  return 'test';
};

export const startServiceWorker = async () => {
  if (typeof window !== 'undefined') {
    const apolloClient = createApolloClient();
    const worker = setupWorker(...getPlaybackHandlers());
    worker.start();

    const { data, errors } = await apolloClient.mutate({
      mutation: CreateHandlerSession.CreateHandlerSessionDocument,
      variables: {
        input: {
          name: generateSessionName(),
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
  }
};
