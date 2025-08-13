import api from './api';

export const getUsers = async () => {
  // const response = await api.get('/users');
  // return response.data;

  // For the sake of this example, we will fetch users role from a public db.json file
  // This is useful for testing without a backend server
  const response = await fetch('/db.json');
  const data = await response.json();
  return data.users || [];
};

export const addUser = async (user) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.patch(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
