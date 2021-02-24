import { graphql, setupWorker } from 'msw';

import { playbackHandler } from './playbackHandler';
import { initialize as initializeState } from './state';

const anyAlphaNumericStringReqExp = /^[a-z0-9]+$/i;

type StartServiceWorker = (params: {
  publicPath?: string;
  schemaMappings?: { [actualSchemaUrl: string]: string };
}) => Promise<any>;
export const startServiceWorker: StartServiceWorker = async ({
  publicPath,
  schemaMappings,
}) => {
  schemaMappings = schemaMappings || {};

  initializeState({ schemaMappings });

  const worker = setupWorker(
    ...[
      graphql.query(anyAlphaNumericStringReqExp, playbackHandler),
      graphql.mutation(anyAlphaNumericStringReqExp, playbackHandler),
    ]
  );
  console.log('worker', worker);

  const publicPathWithSlash =
    publicPath && publicPath !== '' ? `${publicPath}/` : '';
  const swRegistration = await worker.start({
    serviceWorker: {
      url: `/${publicPathWithSlash}mockServiceWorker.js`,
    },
  });

  console.log('swRegistration', swRegistration);

  return swRegistration;
};
