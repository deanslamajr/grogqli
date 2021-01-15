import { setupWorker } from 'msw';

import { create as createApolloClient } from './apolloClient';
import { getPlaybackHandlers, getRecordHandlers } from './webHandlers';

type HandlerState =
  | {
      mode: 'RECORDING';
    }
  | {
      mode: 'PLAYBACK';
    }
  | {
      mode: 'PASSTHROUGH';
    };

const initialState: HandlerState = {
  mode: 'RECORDING',
};

const handlerState: HandlerState = {
  ...initialState,
};

export const startServiceWorker = async () => {
  if (typeof window !== 'undefined') {
    const apolloClient = createApolloClient();
    const worker = setupWorker(...getPlaybackHandlers());
    worker.start();

    // const {sessionId} = await apolloClient.mutate('CREATE_SESSION', {variables: {
    //   input: {
    //     name: getNameFromBrowser()
    //   }
    // }})

    // apolloClient.subscribe('handlerStateChange', {variables: {sessionId}, onUpdate: (newState: HandlerState) => {
    //   updateState(newState);

    //   if (newState.mode === 'RECORDING') {
    //     const recordingHandlers = getRecordingHandlers()
    //     worker.resetHandlers(...recordingHandlers)
    //   }

    //   if (newState.mode === 'PLAYBACK') {
    //     const playbackHandlers = getPlaybackHandlers()
    //     worker.resetHandlers(...playbackHandlers)
    //   }

    //   if (newState.mode === 'PASSTHROUGH') {
    //     const passthroughHandlers = getPassthroughHandlers()
    //     worker.resetHandlers(...passthroughHandlers)
    //   }
    // });
  }
};
