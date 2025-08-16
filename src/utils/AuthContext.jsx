import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data: userProfile } = await api.get('/users/me');
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          // Token might be invalid/expired
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        // Set token for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user profile
        const { data: userProfile } = await api.get('/users/me');
        setUser(userProfile);
        return userProfile;
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Remove auth header from subsequent requests
    delete api.defaults.headers.common['Authorization'];
  };

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
