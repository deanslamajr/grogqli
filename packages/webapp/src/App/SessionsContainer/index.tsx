import React, { FC, useEffect, useState } from 'react';
import { useHistory, useLocation, Route, Switch } from 'react-router-dom';
import { parse } from 'querystring';
import { GetHandlers, Handler } from '@grogqli/schema';
import { useLazyQuery } from '@apollo/client';

import { Session, pagesConfig } from './Session';

interface Props {}

const getSelectedSession = (sessions: Handler[]): Handler => {
  return sessions[0];
};

export const SessionsContainer: FC<Props> = ({}) => {
  const [sessions, setSessions] = useState<Handler[] | null>(null);
  let location = useLocation();
  const history = useHistory();

  const [getHandlerSessions, { data }] = useLazyQuery(
    GetHandlers.GetHandlersDocument
  );

  useEffect(() => {
    if (location.search === '') {
      return;
    }

    const qsWithoutQuestionMark = location.search.substring(1);
    const queryStrings = parse(qsWithoutQuestionMark);

    if (queryStrings.s) {
      const sessionIds = Array.isArray(queryStrings.s)
        ? queryStrings.s
        : [queryStrings.s];
      getHandlerSessions({
        variables: { input: { sessionIds } },
      });
    }
  }, [location.search]);

  useEffect(() => {
    if (data && data.handlers !== null) {
      setSessions(data.handlers);
      const selectedSession = getSelectedSession(data.handlers);
      history.push(`/session/${selectedSession.id}/${pagesConfig[0].path}`);
    }
  }, [data?.handlers]);

  return (
    <Switch>
      <Route path="/session/:sessionId">
        <Session sessions={sessions} />
      </Route>
      <Route>
        <div>Loading...</div>
      </Route>
    </Switch>
  );
};
