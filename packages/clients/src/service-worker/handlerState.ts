interface HandlerState {
  sessionId: string;
}

let handlerState: HandlerState;

const throwIfNotInitialized = () => {
  if (!handlerState) {
    throw new Error('Handler state has not been initialized.');
  }
};

export const getSessionId = (): string => {
  throwIfNotInitialized();
  return handlerState.sessionId;
};

export const setSessionId = (sessionId: string): void => {
  throwIfNotInitialized();
  handlerState.sessionId = sessionId;
};

type Initialize = (params: { sessionId: string }) => void;
export const initialize: Initialize = ({ sessionId }) => {
  handlerState = {} as HandlerState;
  setSessionId(sessionId);
};
