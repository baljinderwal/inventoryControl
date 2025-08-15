import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../services/userService';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.get(`/users?email=${email}&password=${password}`);

      if (response.data.length > 0) {
        const loggedInUser = response.data[0];
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      // 1. Check if user with the same email already exists
      const existingUsers = await api.get(`/users?email=${email}`);
      if (existingUsers.data.length > 0) {
        throw new Error('An account with this email already exists.');
      }

      // 2. If not, create the new user
      const newUser = {
        name,
        email,
        password, // In a real app, this should be hashed!
        role: 'Staff', // Default role for new signups
      };
      const createdUser = await userService.api.addUser(newUser);
      return createdUser;
    } catch (error) {
      console.error('Signup failed', error);
      // Re-throw the error so the component can catch it
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
