import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApolloProvider, ApolloClient } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import Transactions from './Transactions';
import GlobalStyles from './GlobalStyles';

import { cssTheme } from '../constants';

interface Props {
  apolloClient: ApolloClient<any>;
}

const App: React.FC<Props> = ({ apolloClient }) => (
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={cssTheme}>
      <GlobalStyles />
      <Switch>
        <Route exact={true} path="/" component={Transactions} />
      </Switch>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
