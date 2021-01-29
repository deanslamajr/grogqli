import React, { FC, useEffect, useState } from 'react';
import { useHistory, useLocation, Route, Switch } from 'react-router-dom';
import { parse } from 'querystring';
import { GetHandlers, Handler } from '@grogqli/schema';
import { useLazyQuery } from '@apollo/client';

import { Session, pagesConfig } from './Session';
import { SessionsTabs } from './SessionsTabs';

interface Props {}

const getSelectedSession = (sessions: Handler[]): Handler => {
  return sessions[0];
};

export const SessionsContainer: FC<Props> = ({}) => {
  const [sessions, setSessions] = useState<Handler[] | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

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
      setActiveSessionId(selectedSession.id);
    }
  }, [data?.handlers]);

  useEffect(() => {
    if (activeSessionId) {
      history.push(`/session/${activeSessionId}/${pagesConfig[0].path}`);
    }
  }, [activeSessionId]);

  return (
    <Switch>
      <Route path="/session/:sessionId">
        <>
          <SessionsTabs
            changeSession={setActiveSessionId}
            sessions={sessions}
          />
          <Session sessions={sessions} />
        </>
      </Route>
      <Route>
        <div>Loading...</div>
      </Route>
    </Switch>
  );
};
