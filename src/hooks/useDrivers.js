import { useQuery } from '@tanstack/react-query';
import { driversApi } from '../api/drivers';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: driversApi.list,
    staleTime: 1000 * 60 * 15,
  });
}
