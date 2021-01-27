import React from 'react';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { ThemeProvider } from 'styled-components';

import GlobalStyles from './GlobalStyles';

import { cssTheme } from './constants';
import { SessionsContainer } from './SessionsContainer';

interface Props {
  apolloClient: ApolloClient<any>;
}

const App: React.FC<Props> = ({ apolloClient }) => (
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={cssTheme}>
      <GlobalStyles />
      <SessionsContainer />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
