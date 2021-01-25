import {
  ApolloClient,
  ApolloLink,
  from,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { SchemaLink } from 'apollo-link-schema';

import { createApolloClient as createClient } from '../../shared/createApolloClient';

import gqlSchema from '../graphql/schema';

export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
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
