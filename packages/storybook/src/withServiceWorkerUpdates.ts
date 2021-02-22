import React from 'react';
import { DecoratorFunction, useChannel } from '@storybook/client-api';
import { EVENTS } from './constants';

export const WithServiceWorkerUpdates: DecoratorFunction = (storyFn) => {
  const emit = useChannel({
    [EVENTS.SET_WORKFLOW_ID]: (newWorkflowId) => {
      const { setWorkflowId } = require('./handler/state');
      setWorkflowId(newWorkflowId);
    },
  });

  React.useEffect(() => {
    emit(EVENTS.SW_INITIALIZED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return storyFn();
};
