import { HandlerState as Modes } from '@grogqli/schema';

interface State {
  mode: Modes;
  sessionId: string;
  workflowId: string | null;
}

let state: State;

const throwIfNotInitialized = () => {
  if (!state) {
    throw new Error('Handler state has not been initialized.');
  }
};

// mode
export const getMode = (): Modes => {
  throwIfNotInitialized();
  return state.mode;
};

export const setMode = (newMode: Modes): void => {
  throwIfNotInitialized();
  state.mode = newMode;
};

// sessionId
export const getSessionId = (): string => {
  throwIfNotInitialized();
  return state.sessionId;
};

export const setSessionId = (sessionId: string): void => {
  throwIfNotInitialized();
  state.sessionId = sessionId;
};

// workflowId
export const getWorkflowId = (): string | null => {
  throwIfNotInitialized();
  return state.workflowId;
};

export const setWorkflowId = (newWorkflowId: string | null): void => {
  throwIfNotInitialized();
  state.workflowId = newWorkflowId;
};

type Initialize = (params: {
  mode?: Modes;
  sessionId: string;
  workflowId?: string;
}) => void;
export const initialize: Initialize = ({
  mode = Modes.Recording,
  sessionId,
  workflowId = null,
}) => {
  state = {} as State;

  setSessionId(sessionId);
  setMode(mode);
  setWorkflowId(workflowId);
};
