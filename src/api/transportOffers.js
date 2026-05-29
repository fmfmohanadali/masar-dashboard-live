import { api } from './client';

export const transportOffersApi = {
  create: async ({ requestId, carrierCompany, price, estimatedPickupAt, note }) => {
    const { data } = await api.post('/transport-offers/', {
      request: requestId,
      carrier_company: Number(carrierCompany),
      price,
      estimated_pickup_at: estimatedPickupAt || null,
      note: note || '',
    });
    return data;
  },
};
