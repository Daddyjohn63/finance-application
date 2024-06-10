//compared with Ants - same as video BUT return is different in his files and this has fixed my TypeScript error
import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await client.api.transactions[':id'].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      const { data } = await response.json();
      return {
        ...data,

        amount: convertAmountFromMiliunits(data.amount)
        //data
      };
    }
  });

  return query;
};
