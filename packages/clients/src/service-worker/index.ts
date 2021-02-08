import { setupWorker } from 'msw';
import {
  CreateHandlerSession,
  OnHandlerStateChange,
  HandlerState as Modes,
} from '@grogqli/schema';

import { create as createApolloClient } from './apolloClient';
import {
  initialize as initializeState,
  getMode,
  setMode,
  getWorkflowId,
  setWorkflowId,
} from './handlerState';

type StartServiceWorker = (params: {
  name?: string;
  port: number;
}) => Promise<string>;

export const startServiceWorker: StartServiceWorker = async ({
  name = window.document.URL.toString(),
  port,
}) => {
  const apolloClient = createApolloClient({ port });

  const { getPlaybackHandlers, getRecordingHandlers } = await import(
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
        if (!data || !data.handlerStateChanged) {
          throw new Error('onHandlerStateChange didnt return expected data!');
        }

        const {
          currentState: newMode,
          workflowId: newWorkflowId,
        } = data.handlerStateChanged;

        // Update mode?
        if (getMode() !== newMode) {
          setMode(newMode);

          if (newMode === Modes.Recording) {
            worker.resetHandlers(...getRecordingHandlers());
          }

          if (newMode === Modes.Playback) {
            worker.resetHandlers(...getPlaybackHandlers());
          }

          // if (newState === 'PASSTHROUGH') {
          //   const passthroughHandlers = getPassthroughHandlers()
          //   worker.resetHandlers(...passthroughHandlers)
          // }
        }

        // Update workflowId?
        if (getWorkflowId() !== newWorkflowId) {
          setWorkflowId(newWorkflowId);
        }
      },
      error(error) {
        throw error;
      },
    });

  return handlerSessionId;
};
