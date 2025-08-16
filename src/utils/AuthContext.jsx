import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useApi } from './ApiModeContext'; // Import useApi to get the current mode

const AuthContext = createContext();

const JSON_SERVER_URL = 'http://localhost:3001';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { mode } = useApi(); // Get the current API mode

  // --- API Mode (Remote) Functions ---
  const loginApi = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    if (!token) throw new Error('Login failed: No token received');

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data: userProfile } = await api.get('/users/me');
    setUser(userProfile);
    return userProfile;
  };

  const signupApi = async (name, email, password) => {
    await api.post('/auth/register', { name, email, password });
  };

  const checkLoggedInApi = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data: userProfile } = await api.get('/users/me');
        setUser(userProfile);
      } catch (error) {
        console.error('API Mode: Failed to fetch user profile', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // --- Local Mode (json-server) Functions ---
  const loginLocal = async (email, password) => {
    const response = await fetch(`${JSON_SERVER_URL}/users?email=${email}&password=${password}`);
    const users = await response.json();
    if (users.length === 1) {
      const userData = users[0];
      localStorage.setItem('mock_session', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    throw new Error('Invalid credentials');
  };

  const signupLocal = async (name, email, password) => {
    // Check if user already exists
    const checkResponse = await fetch(`${JSON_SERVER_URL}/users?email=${email}`);
    const existingUsers = await checkResponse.json();
    if (existingUsers.length > 0) {
      throw new Error('An account with this email already exists.');
    }

    // Create new user with a default role
    const newUser = { name, email, password, role: 'Staff' };
    const createResponse = await fetch(`${JSON_SERVER_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create user on the local server.');
    }
  };

  const checkLoggedInLocal = useCallback(async () => {
    const sessionData = localStorage.getItem('mock_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        setUser(userData);
      } catch (error) {
        console.error('Local Mode: Failed to parse session data', error);
        localStorage.removeItem('mock_session');
      }
    }
  }, []);

  // --- Main Effect to Check Login Status on Load/Mode Change ---
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        if (mode === 'api') {
          await checkLoggedInApi();
        } else {
          await checkLoggedInLocal();
        }
      } catch (error) {
        console.error(`Failed to check session in ${mode} mode`, error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [mode, checkLoggedInApi, checkLoggedInLocal]);

  // --- Delegator Functions ---
  const login = useCallback(async (email, password) => {
    try {
      if (mode === 'api') {
        return await loginApi(email, password);
      }
      return await loginLocal(email, password);
    } catch (error) {
      console.error(`${mode.toUpperCase()} mode login failed:`, error);
      throw error;
    }
  }, [mode]);

  const signup = useCallback(async (name, email, password) => {
    try {
      if (mode === 'api') {
        return await signupApi(name, email, password);
      }
      return await signupLocal(name, email, password);
    } catch (error) {
      console.error(`${mode.toUpperCase()} mode signup failed:`, error);
      throw error;
    }
  }, [mode]);

  const logout = useCallback(() => {
    localStorage.removeItem('token'); // For API mode
    localStorage.removeItem('mock_session'); // For local mode
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
