import api from './api';

const local = {
  getUsers: async () => {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.users || [];
  },
  addUser: async (user) => {
    console.warn('Read-only mode: addUser disabled.', user);
    return Promise.resolve(user);
  },
  updateUser: async (id, user) => {
    console.warn('Read-only mode: updateUser disabled.', id, user);
    return Promise.resolve(user);
  },
  deleteUser: async (id) => {
    console.warn('Read-only mode: deleteUser disabled.', id);
    return Promise.resolve();
  },
};

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

export const userService = { local, api: remote };
