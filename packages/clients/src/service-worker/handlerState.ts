import { HandlerState as Modes } from '@grogqli/schema';

interface State {
  mode: Modes;
  sessionId: string | null;
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
export const getSessionId = (): string | null => {
  throwIfNotInitialized();
  return state.sessionId;
};

export const setSessionId = (sessionId: string | null): void => {
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
  mode: Modes;
  sessionId?: string;
  workflowId?: string;
}) => void;
export const initialize: Initialize = ({ mode, sessionId, workflowId }) => {
  state = {} as State;

  setMode(mode);
  setSessionId(sessionId || null);
  setWorkflowId(workflowId || null);
};
