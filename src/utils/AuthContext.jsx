import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async () => {
    try {
      // In a real app, you'd use email and password to authenticate.
      // Here, we're simulating a successful login for any of the predefined users.
      // We'll just log in as the admin user for this example.
      const response = { data: [{ "id": 1, "name": "Admin User", "email": "admin@example.com", "password": "password", "role": "Admin" }] };

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

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
