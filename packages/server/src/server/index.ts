import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { updateRecording } from './recorder';
import { renderAppForAllGetPathsExceptGraphql } from './renderApp';

export { apolloServer } from './graphql';

export const server = express()
  .disable('x-powered-by')
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .put('/recording/:id', updateRecording)
  .use(renderAppForAllGetPathsExceptGraphql);
