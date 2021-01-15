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

export const getRecordHandlers = () => {
  return getHandlers(recordHandler);
};

export const getPlaybackHandlers = () => {
  return getHandlers(playbackHandler);
};
