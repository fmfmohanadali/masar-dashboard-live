import { api, normalizeList } from './client';

export const companiesApi = {
  list: async () => {
    const { data } = await api.get('/companies/');
    return normalizeList(data);
  },
};
