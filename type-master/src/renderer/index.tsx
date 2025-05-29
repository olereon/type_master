import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { theme } from './styles/theme';
import './styles/global.css';

console.log('Type Master: Starting application...');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element:', rootElement);
  
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created');

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
  
  console.log('Type Master: App rendered successfully');
} catch (error) {
  console.error('Type Master: Error during initialization:', error);
  document.body.innerHTML = `<h1>Error: ${error}</h1>`;
}