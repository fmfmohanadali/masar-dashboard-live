import { api, normalizeList } from './client';

export const driversApi = {
  list: async () => {
    const { data } = await api.get('/drivers/');
    return normalizeList(data);
  },
};
