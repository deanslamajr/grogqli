import { HandlerState as Modes } from '@grogqli/schema';

interface HandlerState {
  mode: Modes;
  sessionId: string;
  workflowId: string | null;
}

let handlerState: HandlerState;

const throwIfNotInitialized = () => {
  if (!handlerState) {
    throw new Error('Handler state has not been initialized.');
  }
};

// mode
export const getMode = (): Modes => {
  throwIfNotInitialized();
  return handlerState.mode;
};

export const setMode = (newMode: Modes): void => {
  throwIfNotInitialized();
  handlerState.sessionId = newMode;
};

// sessionId
export const getSessionId = (): string => {
  throwIfNotInitialized();
  return handlerState.sessionId;
};

export const setSessionId = (sessionId: string): void => {
  throwIfNotInitialized();
  handlerState.sessionId = sessionId;
};

// workflowId
export const getWorkflowId = (): string | null => {
  throwIfNotInitialized();
  return handlerState.workflowId;
};

export const setWorkflowId = (newWorkflowId: string | null): void => {
  throwIfNotInitialized();
  handlerState.workflowId = newWorkflowId;
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
  handlerState = {} as HandlerState;

  setSessionId(sessionId);
  setMode(mode);
  setWorkflowId(workflowId);
};
