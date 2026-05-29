import { api, normalizeList } from './client';

export const bookingSlotsApi = {
  list: async () => {
    const { data } = await api.get('/booking-slots/');
    return normalizeList(data);
  },

  available: async (date) => {
    const params = date ? { date } : {};
    const { data } = await api.get('/booking-slots/available/', { params });
    return normalizeList(data);
  },
};
