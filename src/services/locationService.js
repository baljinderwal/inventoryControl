import api from './api';

export const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

export const addLocation = async (location) => {
  const response = await api.post('/locations', location);
  return response.data;
};

export const updateLocation = async (id, location) => {
  const response = await api.put(`/locations/${id}`, location);
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
};
