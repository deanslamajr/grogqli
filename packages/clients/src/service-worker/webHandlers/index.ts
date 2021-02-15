import { graphql } from 'msw';
import { HandlerState as Modes } from '@grogqli/schema';

import recordHandler from './recordHandler';
import playbackHandler from './playbackHandler';

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

type Handlers = [
  ReturnType<typeof graphql.query>,
  ReturnType<typeof graphql.mutation>
];

const createHandlers = (handler): Handlers => [
  graphql.query(anyAlphaNumericStringReqExp, handler),
  graphql.mutation(anyAlphaNumericStringReqExp, handler),
];

const getRecordingHandlers = () => {
  return createHandlers(recordHandler);
};

const getPlaybackHandlers = () => {
  return createHandlers(playbackHandler);
};

type GetHandlers = (mode: Modes) => Handlers;
export const getHandlers: GetHandlers = (mode) => {
  if (mode === Modes.Recording) {
    return getRecordingHandlers();
  }
  if (mode === Modes.Playback) {
    return getPlaybackHandlers();
  }
  throw new Error(`The given mode:${mode} is not supported at this time.`);
};
