import React from 'react';
import { Placeholder, OptionsControl } from '@storybook/components';
import { useChannel } from '@storybook/api';
import { EVENTS } from '../constants';

type WorkflowConfigurationViewProps = {
  defaultWorkflowId?: string;
  workflowIds: string[];
};

export const WorkflowConfigurationView: React.FC<WorkflowConfigurationViewProps> = ({
  defaultWorkflowId,
  workflowIds,
}) => {
  const [workflowId, setWorkflowId] = React.useState<string | undefined>(
    defaultWorkflowId || workflowIds?.[0]
  );

  const [isSwInitialized, setIsSwInitialized] = React.useState(false);

  const emit = useChannel({
    [EVENTS.SET_WORKFLOW_ID]: (newWorkflowId) => setWorkflowId(newWorkflowId),
    [EVENTS.SW_INITIALIZED]: () => setIsSwInitialized(true),
  });

  React.useEffect(() => {
    if (isSwInitialized && workflowId !== undefined) {
      emit(EVENTS.SET_WORKFLOW_ID, workflowId);
    }
  }, [emit, isSwInitialized, workflowId]);

  return (
    <Placeholder>
      <OptionsControl
        name="workflowId"
        value={workflowId}
        options={workflowIds}
        onChange={(selectedWorkflowId) => {
          setWorkflowId(selectedWorkflowId);
          emit(EVENTS.SET_WORKFLOW_ID, selectedWorkflowId);
        }}
        type="select"
      />
    </Placeholder>
  );
};
