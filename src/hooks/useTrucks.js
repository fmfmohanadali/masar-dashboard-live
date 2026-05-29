import { useQuery } from '@tanstack/react-query';
import { trucksApi } from '../api/trucks';

export function useTrucks() {
  return useQuery({
    queryKey: ['trucks'],
    queryFn: trucksApi.list,
    staleTime: 1000 * 60 * 15,
  });
}
