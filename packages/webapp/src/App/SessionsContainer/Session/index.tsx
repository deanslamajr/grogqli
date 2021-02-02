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
    label: 'Mocking',
    component: MockingPage,
    path: 'mocking',
  },
];

interface Props {}

export const Session: FC<Props> = ({}) => {
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
    </>
  );
};
