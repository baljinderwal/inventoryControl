import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Function to decode JWT token
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Invalid token');
    return null;
  }
};


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedUser = decodeJwt(token);
      if (decodedUser) {
        return decodedUser;
      }
    }
    return null;
  });

  const login = async (email, password) => {
    try {
      // Simulate a network request to the local JSON server
      const response = await axios.get('http://localhost:3001/users');
      const users = response.data;
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Create a dummy JWT token for local development
        const tokenPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        const token = `dummy-header.${btoa(JSON.stringify(tokenPayload))}.dummy-signature`;

        localStorage.setItem('authToken', token);
        setUser(tokenPayload);
        return tokenPayload;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      throw new Error(error.message || 'An unexpected error occurred.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Also remove old key for hygiene
    setUser(null);
  };

  const signup = async (name, email, password, role) => {
    console.log('Attempting to sign up with:', { name, email, password, role });
    try {
      await axios.post('https://inventorybackend-loop.onrender.com/auth/register', {
        name,
        email,
        password,
        role,
      });
      // Signup successful, do not expect a token.
      // The calling component will now call login().
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'An unknown error occurred during signup.');
      } else if (error.request) {
        throw new Error('Network error, please try again.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
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
