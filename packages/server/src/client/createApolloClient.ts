import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';

interface CreateApolloClientParams {
  initialState?: any;
  isSSRMode?: boolean;
  link: ApolloLink;
}

export const createApolloClient = (params: CreateApolloClientParams) => {
  const cache = new InMemoryCache();
  if (params?.initialState) {
    cache.restore(params.initialState);
  }

  const ssrMode = Boolean(params.isSSRMode);

  return new ApolloClient({
    ssrMode,
    link: params.link,
    cache,
    // ssrForceFetchDelay: 100,
  });
}