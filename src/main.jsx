import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import { ApiModeProvider } from './utils/ApiModeContext';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// A simple default theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <CssBaseline />
          <BrowserRouter>
            <AuthProvider>
              <ApiModeProvider>
                <App />
              </ApiModeProvider>
            </AuthProvider>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
