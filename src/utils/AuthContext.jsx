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
  } catch {
    console.error('Invalid token');
    return null;
  }
};


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedUser = decodeJwt(token);
      if (decodedUser) {
        setUser(decodedUser);
      }
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
        const decodedUser = decodeJwt(token);
        if (decodedUser) {
          setUser(decodedUser);
          return decodedUser;
        } else {
          throw new Error('Invalid token received from server.');
        }
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

  const signup = async (name, email, password, role) => {
    console.log('Attempting to sign up with:', { name, email, password, role });
    try {
      await axios.post('https://inventorybackend-loop.onrender.com/auth/register', {
        name,
        email,
        password,
        role,
      });
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

  const comprehensiveSignup = async (formData) => {
    console.log('Attempting to comprehensively sign up with:', formData);
    try {
      await axios.post('https://inventorybackend-loop.onrender.com/auth/comprehensive-register', formData);
    } catch (error) {
      console.error('Comprehensive signup failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'An unknown error occurred during signup.');
      } else if (error.request) {
        throw new Error('Network error, please try again.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  };

  const updateProfile = async (formData) => {
    console.log('Attempting to update profile with:', formData);
    try {
      await axios.put('https://inventorybackend-loop.onrender.com/auth/profile', formData);
    } catch (error) {
      console.error('Profile update failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'An unknown error occurred during profile update.');
      } else if (error.request) {
        throw new Error('Network error, please try again.');
      } else {
        throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup, comprehensiveSignup, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
