import React from 'react';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { DefaultTheme, ThemeProvider } from 'styled-components';

import GlobalStyles from './GlobalStyles';

interface Props {
  apolloClient: ApolloClient<any>;
  cssTheme: DefaultTheme;
}

export const Providers: React.FC<Props> = ({
  apolloClient,
  children,
  cssTheme,
}) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={cssTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ApolloProvider>
  );
};
