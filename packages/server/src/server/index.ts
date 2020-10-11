import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { updateRecording } from './recorder';
import { renderApp } from './renderApp';

export { apolloServer } from './graphql';

const name = 'grogqli';
// const grogqliPath = `/${name}`;
// console.log(`\/((?!${name}).)*`)
// replace with https://github.com/jfromaniello/express-unless
const everything_but_grogqli_path = new RegExp(`\/((?!${name}).)*`); // eslint-disable-line no-useless-escape

export const server = express()
  .disable('x-powered-by')
  .use(cors())
  .use(bodyParser.json())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .put('/recording/:id', updateRecording)
  .get(everything_but_grogqli_path, renderApp);
