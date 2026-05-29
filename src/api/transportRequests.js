import { api, normalizeList, cleanPayload } from './client';

export const transportRequestsApi = {
  list: async () => {
    const { data } = await api.get('/transport-requests/');
    return normalizeList(data);
  },

  get: async (id) => {
    const { data } = await api.get(`/transport-requests/${id}/`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post('/transport-requests/', cleanPayload(payload));
    return data;
  },

  // Actions
  verify: async (id) => {
    const { data } = await api.post(`/transport-requests/${id}/verify/`);
    return data;
  },

  sendOffers: async (id) => {
    const { data } = await api.post(`/transport-requests/${id}/send_offers/`);
    return data;
  },

  selectOffer: async (id, offerId) => {
    const { data } = await api.post(`/transport-requests/${id}/select_offer/`, {
      offer_id: offerId,
    });
    return data;
  },

  markPaid: async (id, { amount, method = 'manual', transactionRef }) => {
    const { data } = await api.post(`/transport-requests/${id}/mark_paid/`, {
      amount,
      method,
      transaction_ref: transactionRef || `MANUAL-${Date.now()}`,
    });
    return data;
  },

  assignDriver: async (id, { driverId, truckId }) => {
    const { data } = await api.post(`/transport-requests/${id}/assign_driver/`, {
      driver_id: Number(driverId),
      truck_id: Number(truckId),
    });
    return data;
  },

  bookSlot: async (id, slotId) => {
    const { data } = await api.post(`/transport-requests/${id}/book_slot/`, {
      slot_id: Number(slotId),
    });
    return data;
  },

  issueQr: async (id) => {
    const { data } = await api.post(`/transport-requests/${id}/issue_qr/`);
    return data;
  },
};
