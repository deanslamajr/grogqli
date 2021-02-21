import React from 'react';
import { Placeholder, OptionsControl } from "@storybook/components";
import { useChannel } from "@storybook/api";
import { EVENTS } from "../constants";

export const WorkflowConfigurationView = ({
  defaultWorkflowId,
  workflowIds
}) => {
  const [workflowId, setWorkflowId] = React.useState(
    defaultWorkflowId ||
    workflowIds[0]
  );
  const [isSwInitialized, setIsSwInitialized] = React.useState(false);

  const emit = useChannel({
    [EVENTS.SET_WORKFLOW_ID]: (newWorkflowId) => setWorkflowId(newWorkflowId),
    [EVENTS.SW_INITIALIZED]: () => setIsSwInitialized(true)
  });

  React.useEffect(() => {
    if (isSwInitialized) {
      emit(EVENTS.SET_WORKFLOW_ID, workflowId);
    }
  }, [isSwInitialized]);

  return (<Placeholder>
    <React.Fragment>
      <OptionsControl
        value={workflowId}
        options={workflowIds}
        onChange={(selectedWorkflowId) => {
          setWorkflowId(selectedWorkflowId);
          emit(EVENTS.SET_WORKFLOW_ID, selectedWorkflowId);
        }}
        type="select"
      />
    </React.Fragment>
  </Placeholder>)
}