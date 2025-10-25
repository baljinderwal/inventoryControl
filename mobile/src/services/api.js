import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use emulator-friendly host for Android (10.0.2.2). For physical devices
// replace with your machine IP, e.g. http://192.168.1.42:3001
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
const API_URL = DEFAULT_API_URL;

const api = axios.create({ baseURL: API_URL });

// Attach token if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
