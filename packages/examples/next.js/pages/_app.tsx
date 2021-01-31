import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { useApollo } from "../lib/apollo";

if (typeof window !== 'undefined') {
  const port = 5678;
  const { mountClient, startServiceWorker } = require('@grogqli/clients');
  startServiceWorker({ port }).then((sessionId) => {
    console.log('> new grogqli handler session created, id:', sessionId);
    mountClient({
      initialSessionId: sessionId,
      port
    });
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
