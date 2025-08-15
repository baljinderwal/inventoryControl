import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventorybackend-loop.onrender.com/', // The port where json-server will run
});

export default api;
