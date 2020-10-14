import express from 'express';
import cors from 'cors';

import { renderAppForAllGetPathsExceptGraphql } from './renderApp';
import { apolloServer as _apolloServer } from './graphql';
import { grogqliPath } from '../shared/constants';

const server = express()
  .disable('x-powered-by')
  .use(cors())
  .use(renderAppForAllGetPathsExceptGraphql);

_apolloServer.applyMiddleware({ app: server, path: grogqliPath });
export const apolloServer = _apolloServer;
