import express from 'express';
import cors from 'cors';

import { renderAppForAllGetPathsExceptGraphql } from './renderApp';

export { apolloServer } from './graphql';
export const server = express()
  .disable('x-powered-by')
  .use(cors())
  .use(renderAppForAllGetPathsExceptGraphql)
  // adjust this if the following error:
  // PayloadTooLargeError: request entity too large
  .use(express.json({ limit: '25mb' }));
