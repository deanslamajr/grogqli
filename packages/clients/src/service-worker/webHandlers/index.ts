import { graphql } from 'msw';

import recordHandler from './recordHandler';
import playbackHandler from './playbackHandler';

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

type Handlers = [
  ReturnType<typeof graphql.query>,
  ReturnType<typeof graphql.mutation>
];

const getHandlers = (handler): Handlers => [
  graphql.query(anyAlphaNumericStringReqExp, handler),
  graphql.mutation(anyAlphaNumericStringReqExp, handler),
];

export const getRecordingHandlers = () => {
  console.log('setting recording handlers');
  return getHandlers(recordHandler);
};

export const getPlaybackHandlers = () => {
  console.log('setting playback handlers');
  return getHandlers(playbackHandler);
};
