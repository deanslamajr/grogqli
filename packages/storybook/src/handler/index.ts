import { graphql, setupWorker } from 'msw';

import { playbackHandler } from './playbackHandler';
import { initialize as initializeState } from './state';

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

export const startServiceWorker = async ({ schemaMappings }) => {
  initializeState({ schemaMappings });

  const worker = setupWorker(
    ...[
      graphql.query(anyAlphaNumericStringReqExp, playbackHandler),
      graphql.mutation(anyAlphaNumericStringReqExp, playbackHandler),
    ]
  );
  console.log('worker', worker);
  const swRegistration = await worker.start({
    serviceWorker: {
      // TODO have this be set by plugin consumer
      // local env
      // url: '/mockServiceWorker.js',
      // github pages env
      url: '/grogqli/mockServiceWorker.js',
    },
  });

  console.log('swRegistration', swRegistration);

  return swRegistration;
};
