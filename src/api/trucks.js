import { api, normalizeList } from './client';

export const trucksApi = {
  list: async () => {
    const { data } = await api.get('/trucks/');
    return normalizeList(data);
  },
};
