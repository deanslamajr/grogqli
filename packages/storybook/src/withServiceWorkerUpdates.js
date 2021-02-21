import React from 'react';
import { useChannel } from "@storybook/client-api";
import { EVENTS } from "./constants";

export const withServiceWorkerUpdates = (storyFn) => {
  const emit = useChannel({
    [EVENTS.SET_WORKFLOW_ID]: (newWorkflowId) => {
      const {setWorkflowId} = require('./handler/state');
      setWorkflowId(newWorkflowId);
    },
  });

  React.useEffect(() => {
    emit(EVENTS.SW_INITIALIZED);
  }, []);

  return storyFn();
};
