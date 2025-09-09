import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';
import { NotificationCenterProvider } from './utils/NotificationCenterContext';
import { CustomThemeProvider, useThemeContext } from './utils/ThemeContext';
import './index.css';

const queryClient = new QueryClient();

const commonSettings = {
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
};

const themes = {
  light: createTheme({
    ...commonSettings,
    palette: {
      mode: 'light',
      primary: { main: '#4f46e5' },
      secondary: { main: '#10b981' },
      background: { default: '#f8fafc', paper: '#ffffff' },
      text: { primary: '#1e293b', secondary: '#64748b' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #e2e8f0',
          },
        },
      },
    },
  }),
  dark: createTheme({
    ...commonSettings,
    palette: {
      mode: 'dark',
      primary: { main: '#6366f1' },
      secondary: { main: '#ec4899' },
      background: { default: '#0f172a', paper: '#1e293b' },
      text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e293b',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: '1px solid #334155',
          },
        },
      },
    },
  }),
  blue: createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: { main: '#0ea5e9' }, // Sky Blue
        secondary: { main: '#f472b6' }, // Rose
        background: { default: '#f0f9ff', paper: '#ffffff' },
        text: { primary: '#0c4a6e', secondary: '#38bdf8' },
    },
    components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: '#ffffff',
              color: '#0c4a6e',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.07)',
              borderBottom: '1px solid #e0f2fe',
            },
          },
        },
      },
  }),
};

// A simple utility to get the theme by name
export const getTheme = (themeName) => {
    const theme = themes[themeName] || themes.light;
    return responsiveFontSizes(theme);
}

// The AppWrapper will handle theme context logic
const AppWrapper = () => {
  const { themeName } = useThemeContext();
  const theme = getTheme(themeName);

  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <NotificationCenterProvider>
              <App />
            </NotificationCenterProvider>
          </AuthProvider>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AppWrapper />
      </CustomThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
