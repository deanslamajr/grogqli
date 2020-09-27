import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApolloProvider, ApolloClient } from '@apollo/react-hooks';

import Home from './Home';

import './App.css';

interface Props {
  apolloClient: ApolloClient<any>;
}

const App: React.FC<Props> = ({apolloClient}) => (
  <ApolloProvider client={apolloClient}>
    <Switch>
      <Route exact={true} path="/" component={Home} />
    </Switch>
  </ApolloProvider>
);

export default App;
