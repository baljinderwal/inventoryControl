import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import { ApiModeProvider } from './utils/ApiModeContext';
import './index.css';

// Create a client
const queryClient = new QueryClient();

// A clean and professional light theme
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // A strong Indigo
    },
    secondary: {
      main: '#10b981', // A vibrant Green
    },
    background: {
      default: '#f8fafc', // Slate 50 - very light grey
      paper: '#ffffff',   // Pure white
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h4: {
      fontWeight: 700,
      color: '#1e293b',
    },
    h5: {
      fontWeight: 600,
      color: '#334155',
    },
    h6: {
      fontWeight: 600,
      color: '#475569',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e2e8f0', // Slate 200
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

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
