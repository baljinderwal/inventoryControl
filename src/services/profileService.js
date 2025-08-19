import api from './api';

const local = {
  getProfile: async () => {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.userProfile || {};
  },
  updateProfile: async (profile) => {
    console.warn('Read-only mode: updateProfile disabled.', profile);
    return Promise.resolve(profile);
  },
};

const remote = {
  getProfile: async () => {
    const response = await api.get('/auth/userprofile');
    return response.data;
  },
  updateProfile: async (profile) => {
    const response = await api.put('/auth/userprofile', profile);
    return response.data;
  },
};

export const profileService = { local, api: remote };
