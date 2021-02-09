import React from 'react';
import { HandlerState } from '@grogqli/schema';

interface SessionState {
  mode: HandlerState;
  setMode: React.Dispatch<React.SetStateAction<HandlerState>>;
  sessionId: string;
}

type Props = Pick<SessionState, 'sessionId'>;

const Context = React.createContext<SessionState | null>(null);

export const SessionProvider: React.FC<Props> = ({ children, sessionId }) => {
  const [mode, setMode] = React.useState<HandlerState>(HandlerState.Recording);
  const value = React.useMemo(() => ({ mode, setMode, sessionId }), [
    mode,
    sessionId,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSessionState = (): SessionState => {
  const context = React.useContext(Context);
  if (context === null) {
    throw new Error('useSessionState must be used within a SessionProvider.');
  }
  return context;
};
