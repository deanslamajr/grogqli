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
  setSessionId,
  getWorkflowId,
  setWorkflowId,
} from './handlerState';

type StartServiceWorkerParams =
  | {
      initialMode: undefined;
      initialWorkflowId?: string;
      name?: string;
      port: number;
    }
  | {
      initialMode: Modes.Recording;
      initialWorkflowId?: string;
      name?: string;
      port: number;
    }
  | {
      initialMode: Modes.Playback;
      initialWorkflowId: string;
      name?: string;
      port: number;
    };

type StartServiceWorker = (params: StartServiceWorkerParams) => Promise<string>;

export const startServiceWorker: StartServiceWorker = async ({
  initialMode = Modes.Recording as Modes.Recording,
  initialWorkflowId,
  name = window.document.URL.toString(),
  port,
}) => {
  const apolloClient = createApolloClient({ port });

  const { getHandlers } = await import('./webHandlers');

  const handlers = getHandlers(initialMode);
  const worker = setupWorker(...handlers);
  worker.start();

  initializeState({
    mode: initialMode,
    workflowId: initialWorkflowId,
  });

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
  setSessionId(handlerSessionId);

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
          const handlers = getHandlers(newMode);
          worker.resetHandlers(...handlers);
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
