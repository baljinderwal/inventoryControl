import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // The port where json-server will run
});

export default api;
