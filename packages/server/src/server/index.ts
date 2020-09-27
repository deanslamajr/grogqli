import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {apolloServer} from './graphql';

import {recordQuery, updateRecording} from './recorder';
import {renderApp} from './renderApp';

const grogqliPath = '/grogqli';

const server = express()
  .disable('x-powered-by')
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .post(grogqliPath, apolloServer.createHandler({ path: grogqliPath }))
  .post('/recording/:id', recordQuery)
  .put('/recording/:id', updateRecording)
  .get('/*', renderApp);

export default server;
