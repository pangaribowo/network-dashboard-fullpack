// src/App.jsx
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WebSocketProvider } from './components/WebSocketProvider';
import NetworkDashboard from './components/NetworkDashboard';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18next';
import './styles.css';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <WebSocketProvider>
          <NetworkDashboard />
        </WebSocketProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;