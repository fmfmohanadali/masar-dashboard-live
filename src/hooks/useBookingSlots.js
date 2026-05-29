import { useQuery } from '@tanstack/react-query';
import { bookingSlotsApi } from '../api/bookingSlots';

export function useAvailableSlots(date = null) {
  return useQuery({
    queryKey: ['booking-slots', 'available', date],
    queryFn: () => bookingSlotsApi.available(date),
    staleTime: 1000 * 60 * 2,
  });
}
