import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { useApollo } from "../lib/apollo";

if (typeof window !== 'undefined') {
  const { mountClient, startServiceWorker } = require("@grogqli/clients");
  startServiceWorker();
  mountClient();
}

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
