import React from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import {
  GetWorkflows,
  UpdateHandlerSession,
  HandlerState,
} from '@grogqli/schema';

import { useSessionState } from '../../SessionContext';

const StyledMainSubMenuBar = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.menuBarHeight};
  background-color: ${({ theme }) => theme.colors.highGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders};
  line-height: 1.75;
  font-size: 15px;
`;

const PlayButton = styled.span`
  cursor: pointer;
  margin: 0 5px;
  padding: 0 10px;
  display: inline-block;
  color: ${(props) => props.theme.colors.unselectedMenuItemText};

  &:hover {
    color: ${(props) => props.theme.colors.selectedMenuItemUnderline};
    background-color: ${({ theme }) => theme.colors.selectedMenuItemBackground};
  }
`;

const WorkflowsDropdown = styled.select`
  // A reset of styles, including removing the default dropdown arrow
  appearance: none;
  color: ${({ theme }) => theme.colors.selectedMenuItemText};
  background-color: ${({ theme }) => theme.colors.generalBackgroundColor};
  border: none;
  margin: 0 5px;
  padding: 0 5px;
  width: 300px;
  height: calc(${({ theme }) => theme.sizes.menuBarHeight} - 5px);
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;

  &:focus {
    outline: none;
  }
`;

const noValueOptionValue = 'NONE_SELECTED';

export const MockingPage: React.FC<{}> = ({}) => {
  const { data: workflowData, loading: isGettingWorkflows } = useQuery(
    GetWorkflows.GetWorkflowsDocument,
    {
      fetchPolicy: 'network-only',
    }
  );
  const [updateHandlerSession] = useMutation(
    UpdateHandlerSession.UpdateHandlerSessionDocument
  );
  const { mode, setMode, sessionId } = useSessionState();
  const [workflowId, setWorkflowId] = React.useState<string>(
    noValueOptionValue
  );

  return (
    <>
      <StyledMainSubMenuBar>
        {isGettingWorkflows ? (
          'LOADING WORKFLOWS'
        ) : (
          <>
            <WorkflowsDropdown
              name="workflows"
              onChange={(e) => {
                const newValue = e.target.value;
                setWorkflowId(newValue);
              }}
              value={workflowId}
            >
              {workflowData && workflowData.workflows?.map
                ? workflowData.workflows.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))
                : null}
              <option value={noValueOptionValue}>No workflow selected</option>
            </WorkflowsDropdown>
            {workflowId !== noValueOptionValue && (
              <PlayButton
                onClick={async () => {
                  const newMode =
                    mode !== HandlerState.Playback
                      ? HandlerState.Playback
                      : HandlerState.Recording;
                  await updateHandlerSession({
                    variables: {
                      input: {
                        sessionId,
                        name: null,
                        currentState: newMode,
                        workflowId,
                      },
                    },
                  });

                  setMode(newMode);
                }}
              >
                {mode !== HandlerState.Playback ? 'USE MOCK' : 'STOP MOCKING'}
              </PlayButton>
            )}
          </>
        )}
      </StyledMainSubMenuBar>
    </>
  );
};
