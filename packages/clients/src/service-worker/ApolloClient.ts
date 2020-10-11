import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core';

interface GetClientParams {
  url: string;
  fetch: WindowOrWorkerGlobalScope['fetch'];
}

export const getClient = ({ url, fetch }: GetClientParams) => {
  const cache = new InMemoryCache();
  const link = createHttpLink({
    uri: `${url}/grogqli`,
    fetch,
  });

  return new ApolloClient({
    cache,
    link,
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });
};
