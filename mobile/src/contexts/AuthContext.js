import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        setToken(t);
        try {
          const me = await getMe(t);
          setUser(me);
        } catch (e) {
          console.warn('Failed to fetch me', e);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    const t = res.token;
    await AsyncStorage.setItem('token', t);
    setToken(t);
    const me = await getMe(t);
    setUser(me);
    return me;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
