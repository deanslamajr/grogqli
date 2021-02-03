import express from 'express';
import unless from 'express-unless';
import React from 'react';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';

import { renderToStringWithData } from '@apollo/client/react/ssr';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { App } from '@grogqli/webapp';

import { grogqliPath } from '../../shared/constants';
import { getConfig } from '../files/getConfig';
import { createApolloClient } from './createApolloClient';

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const renderApp = async (req: express.Request, res: express.Response) => {
  const context = {} as StaticRouterContext;

  const apolloClient = createApolloClient();

  let markup: string;

  const sheet = new ServerStyleSheet();
  let styleTags;
  try {
    // Run all GraphQL queries
    markup = await renderToStringWithData(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter context={context} location={req.url}>
          <App apolloClient={apolloClient} />
        </StaticRouter>
      </StyleSheetManager>
    );
    styleTags = sheet.getStyleTags();
  } catch (error) {
    // Prevent Apollo Client GraphQL errors from crashing SSR.
    // Handle them in components via the data.error prop:
    // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
    console.error('Error while running `renderToStringWithData`', error);
    return res.sendStatus(500);
  } finally {
    sheet.seal();
  }

  const apolloState = apolloClient.extract();

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    return res.redirect(context.url);
  }

  // Pass some config values to the frontend
  const config = await getConfig();
  const port = config('port');
  const shouldDogFood = config('shouldDogFood');

  res.send(`
    <!doctype html>
    <html lang="">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Grogqli</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
        ${styleTags || ''}
      </head>
      <body>
          <div id="root">${markup}</div>
          <script>
            // SERVER PORT
            window.__PORT__=${port};
            // USE GROGQLI ON GROGQLI?
            window.__SHOULD_DOGFOOD__=${shouldDogFood};
            // GQL SSR
            window.__APOLLO_STATE__=${JSON.stringify(apolloState).replace(
              /</g,
              '\\u003c'
            )};
          </script>
      </body>
    </html>
  `);
};

type RouterWithUnless = express.Router & {
  unless?: typeof unless;
};
const renderAppForAllGetPaths: RouterWithUnless = express
  .Router()
  .get('/*', renderApp);
renderAppForAllGetPaths.unless = unless;
export const renderAppForAllGetPathsExceptGraphql: RouterWithUnless = renderAppForAllGetPaths.unless(
  {
    path: grogqliPath,
  }
);
