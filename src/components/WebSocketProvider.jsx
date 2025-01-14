import React, { createContext, useContext } from 'react';
import useWebSocket from '../hooks/useWebSocket';

// Create WebSocket Context
const WebSocketContext = createContext(null);

// Custom hook to use WebSocket context
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const wsUrl = 'ws://localhost:8080';
  const webSocketProps = useWebSocket(wsUrl);

  return (
    <WebSocketContext.Provider value={webSocketProps}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;