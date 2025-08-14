import api from './api';

const local = {
  getLocations: async () => {
    console.log('Fetching locations from local db.json');
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.locations || [];
  },
  addLocation: async (locationData) => {
    console.warn('Read-only mode: addLocation disabled.', locationData);
    return Promise.resolve(locationData);
  },
  updateLocation: async (id, locationData) => {
    console.warn('Read-only mode: updateLocation disabled.', id, locationData);
    return Promise.resolve(locationData);
  },
  deleteLocation: async (id) => {
    console.warn('Read-only mode: deleteLocation disabled.', id);
    return Promise.resolve();
  },
};

const remote = {
  getLocations: async () => {
    console.log('Fetching locations from API');
    const response = await api.get('/locations');
    return response.data;
  },
  addLocation: async (locationData) => {
    console.log('Adding location via API', locationData);
    const response = await api.post('/locations', locationData);
    return response.data;
  },
  updateLocation: async (id, locationData) => {
    console.log(`Updating location ${id} via API`, locationData);
    const response = await api.patch(`/locations/${id}`, locationData);
    return response.data;
  },
  deleteLocation: async (id) => {
    console.log(`Deleting location ${id} via API`);
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  },
};

export const locationService = { local, api: remote };
