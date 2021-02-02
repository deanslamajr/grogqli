import React from 'react';

interface SessionState {
  sessionId: string;
}

const Context = React.createContext<SessionState | null>(null);

export const SessionProvider: React.FC<SessionState> = ({
  children,
  sessionId,
}) => {
  const value = React.useMemo(() => ({ sessionId }), [sessionId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSessionState = (): SessionState => {
  const context = React.useContext(Context);
  if (context === null) {
    throw new Error('useSessionState must be used within a SessionProvider.');
  }
  return context;
};
