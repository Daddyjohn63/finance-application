//hook
import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<(typeof client.api.accounts)[':id']['$delete']>;

//what kind of request type will we receive i.e. json.

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.accounts[':id']['$delete']({
        param: { id }
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account deleted');
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      //TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to delete account');
    }
  });
  return mutation;
};
