import React, { FC } from 'react';
import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { Handler } from '@grogqli/schema';

import { TopNavBar } from './TopNavBar';
import { RequestsPage } from './RequestsPage';
import { MockingPage } from './MockingPage';

export interface PageConfig {
  label: string;
  component: React.FC;
  path: string;
}

export const pagesConfig: PageConfig[] = [
  {
    label: 'Requests',
    component: RequestsPage,
    path: 'requests',
  },
  {
    label: 'SMocking',
    component: MockingPage,
    path: 'mocking',
  },
];

interface Props {
  sessions: Handler[] | null;
}

export const Session: FC<Props> = ({ sessions }) => {
  const { path: matchedPath } = useRouteMatch();
  return (
    <>
      <TopNavBar pagesConfig={pagesConfig} />
      <Switch>
        {pagesConfig.map(({ path, component }) => (
          <Route
            key={path}
            path={`${matchedPath}/${path}`}
            component={component}
          />
        ))}
      </Switch>
      {JSON.stringify(sessions)}
    </>
  );
};
