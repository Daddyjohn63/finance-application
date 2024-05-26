//hook
import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<(typeof client.api.accounts)[':id']['$patch']>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[':id']['$patch']
>['json']; //what kind of request type will we receive i.e. json.

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.accounts[':id']['$patch']({
        json,
        param: { id }
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account updated');
      queryClient.invalidateQueries({ queryKey: ['account', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      //TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to edit account');
    }
  });
  return mutation;
};
