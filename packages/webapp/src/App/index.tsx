import React from 'react';
import { ApolloClient } from '@apollo/client';
import { SessionsContainer } from './SessionsContainer';

import { cssTheme } from './constants';
import { Providers } from './Providers';

interface Props {
  apolloClient: ApolloClient<any>;
}

const App: React.FC<Props> = ({ apolloClient }) => (
  <Providers apolloClient={apolloClient} cssTheme={cssTheme}>
    <SessionsContainer />
  </Providers>
);

export default App;
