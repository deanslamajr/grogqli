import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ApolloProvider, ApolloClient } from '@apollo/react-hooks';
import { ThemeProvider } from 'styled-components';

import GlobalStyles from './GlobalStyles';

import { TopNavBar } from './TopNavBar';
import { RequestsPage } from './RequestsPage';
import { MockingPage } from './MockingPage';

import { cssTheme } from '../constants';

export interface PageConfig {
  label: string;
  component: React.FC;
  path: string;
}

const pagesConfig: PageConfig[] = [
  {
    label: 'Requests',
    component: RequestsPage,
    path: '/requests',
  },
  {
    label: 'Mocking',
    component: MockingPage,
    path: '/mocking',
  },
];

interface Props {
  apolloClient: ApolloClient<any>;
}

const App: React.FC<Props> = ({ apolloClient }) => (
  <ApolloProvider client={apolloClient}>
    <ThemeProvider theme={cssTheme}>
      <GlobalStyles />
      <TopNavBar pagesConfig={pagesConfig} />
      <Switch>
        <Route exact path="/">
          <Redirect to={pagesConfig[0].path} />
        </Route>
        {pagesConfig.map(({ path, component }) => (
          <Route key={path} exact={true} path={path} component={component} />
        ))}
      </Switch>
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
