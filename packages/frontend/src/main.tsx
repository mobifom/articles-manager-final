// packages/frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/app';
import { AppProvider } from './context/AppContext';
import './styles/main.css';
import './components/web-components'; // Import to register web components

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);