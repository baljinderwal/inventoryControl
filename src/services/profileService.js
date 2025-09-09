import api from './api';

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

export const profileService = remote;
