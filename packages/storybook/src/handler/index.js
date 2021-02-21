import { graphql, setupWorker } from 'msw';

import {playbackHandler} from './playbackHandler';
import {initialize as initializeState} from './state';

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

export const startServiceWorker = async ({
  schemaMappings
}) => {
  initializeState({schemaMappings});

  const worker = setupWorker(...[
    graphql.query(anyAlphaNumericStringReqExp, playbackHandler),
    graphql.mutation(anyAlphaNumericStringReqExp, playbackHandler),
  ]);
  const swRegistration = await worker.start();

  return swRegistration;
}