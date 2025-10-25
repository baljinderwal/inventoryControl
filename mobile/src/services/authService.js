import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const register = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data; // { token }
};

export const getMe = async (token) => {
  const res = await axios.get(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
