import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { transportRequestsApi } from '../api/transportRequests';
import { transportOffersApi } from '../api/transportOffers';

const QUERY_KEY = ['transport-requests'];

// ============ Queries ============

export function useTransportRequests() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: transportRequestsApi.list,
  });
}

// ============ Mutations ============

export function useCreateTransportRequest() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: transportRequestsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('تم إنشاء طلب النقل بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'تعذر إنشاء طلب النقل');
    },
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: transportOffersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('تم إضافة العرض بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || 'تعذر إضافة العرض');
    },
  });
}

// Hook موحد لكل الـ actions
export function useTransportRequestActions() {
  const qc = useQueryClient();
  
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEY });
  };
  
  const onError = (err) => {
    toast.error(err?.response?.data?.detail || 'تعذر تنفيذ الإجراء');
  };
  
  const verify = useMutation({
    mutationFn: transportRequestsApi.verify,
    onSuccess: () => { invalidate(); toast.success('تم التحقق من الطلب'); },
    onError,
  });
  
  const sendOffers = useMutation({
    mutationFn: transportRequestsApi.sendOffers,
    onSuccess: () => { invalidate(); toast.success('تم إرسال العروض'); },
    onError,
  });
  
  const selectOffer = useMutation({
    mutationFn: ({ id, offerId }) => transportRequestsApi.selectOffer(id, offerId),
    onSuccess: () => { invalidate(); toast.success('تم اختيار العرض'); },
    onError,
  });
  
  const markPaid = useMutation({
    mutationFn: ({ id, ...payload }) => transportRequestsApi.markPaid(id, payload),
    onSuccess: () => { invalidate(); toast.success('تم تأكيد الدفع'); },
    onError,
  });
  
  const assignDriver = useMutation({
    mutationFn: ({ id, ...payload }) => transportRequestsApi.assignDriver(id, payload),
    onSuccess: () => { invalidate(); toast.success('تم تخصيص السائق'); },
    onError,
  });
  
  const bookSlot = useMutation({
    mutationFn: ({ id, slotId }) => transportRequestsApi.bookSlot(id, slotId),
    onSuccess: () => { invalidate(); toast.success('تم حجز الموعد'); },
    onError,
  });
  
  const issueQr = useMutation({
    mutationFn: transportRequestsApi.issueQr,
    onSuccess: () => { invalidate(); toast.success('تم إصدار QR'); },
    onError,
  });
  
  return {
    verify,
    sendOffers,
    selectOffer,
    markPaid,
    assignDriver,
    bookSlot,
    issueQr,
    isAnyPending: [verify, sendOffers, selectOffer, markPaid, assignDriver, bookSlot, issueQr]
      .some(m => m.isPending),
  };
    }
