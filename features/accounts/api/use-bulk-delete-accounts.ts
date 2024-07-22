//hook
import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>['json'];
//what kind of request type will we receive i.e. json.

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.accounts['bulk-delete']['$post']({
        json
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Accounts deleted');
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); //make sure we get new data from the server as a new account is been created.
      queryClient.invalidateQueries({ queryKey: ['summary'] }); //make sure we get new data from the server as a new account is been created.
    },
    onError: () => {
      toast.error('Failed to delete accounts');
    }
  });
  return mutation;
};
