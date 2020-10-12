import express from 'express';
import unless from 'express-unless';
import React from 'react';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import {
  ApolloClient,
  ApolloLink,
  from,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SchemaLink } from 'apollo-link-schema';
import { renderToStringWithData } from '@apollo/react-ssr';

import gqlSchema from './graphql/schema';

import App from '../client/App';
import { createApolloClient as createClient } from '../shared/createApolloClient';
import { grogqliPath } from '../shared/constants';

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const schemaLink = new SchemaLink({ schema: gqlSchema });

  // TODO replace this with better logging?
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const link = from([errorLink, (schemaLink as unknown) as ApolloLink]);

  return createClient({
    link,
    isSSRMode: true,
  });
};

const renderApp = async (req: express.Request, res: express.Response) => {
  const context = {} as StaticRouterContext;

  const apolloClient = createApolloClient();
  let markup: string;
  try {
    // Run all GraphQL queries
    markup = await renderToStringWithData(
      <StaticRouter context={context} location={req.url}>
        <App apolloClient={apolloClient} />
      </StaticRouter>
    );
  } catch (error) {
    // Prevent Apollo Client GraphQL errors from crashing SSR.
    // Handle them in components via the data.error prop:
    // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
    console.error('Error while running `renderToStringWithData`', error);
    return res.sendStatus(500);
  }

  // Extract query data from the Apollo store
  // const apolloState = apolloClient.cache.extract();
  const apolloState = apolloClient.extract();

  // const markup = renderToString(
  //   <StaticRouter context={context} location={req.url}>
  //     <App apolloClient={apolloClient} />
  //   </StaticRouter>
  // );

  // context.url will contain the URL to redirect to if a <Redirect> was used
  // TODO needs to be tested
  // if (context.url) {
  //   return res.redirect(context.url);
  // }
  res.send(`
    <!doctype html>
    <html lang="">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle TypeScript</title>
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
      </head>
      <body>
          <div id="root">${markup}</div>
          <script>
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
