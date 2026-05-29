import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { companiesApi } from '../api/companies';

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.list,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCarrierCompanies() {
  const query = useCompanies();
  
  const carriers = useMemo(() => {
    if (!query.data) return [];
    const filtered = query.data.filter((c) => c.company_type === 'carrier');
    return filtered.length ? filtered : query.data;
  }, [query.data]);
  
  return { ...query, data: carriers };
}
