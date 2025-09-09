import api from './api';

const remote = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  addUser: async (user) => {
    const response = await api.post('/users', user);
    return response.data;
  },
  updateUser: async (id, user) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const userService = remote;
