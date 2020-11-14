import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { mountClient, startServiceWorker } from "@grogqli/clients";

import { useApollo } from "../lib/apollo";

startServiceWorker();
mountClient();

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
