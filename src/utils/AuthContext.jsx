import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://inventorybackend-loop.onrender.com/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        const userPayload = { token };
        setUser(userPayload);
        return userPayload;
      } else {
        throw new Error('Login failed: No token received.');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      if (error.response) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        throw new Error('Network error, please try again.');
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Also remove old key for hygiene
    setUser(null);
  };

  const signup = async (name, email, password) => {
    // This is out of scope for the current task, but we leave it as is.
    try {
      const newUser = {
        id: Date.now(),
        name,
        email,
        role: 'Admin',
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
