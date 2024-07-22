//hook
import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<
  (typeof client.api.categories)['bulk-delete']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)['bulk-delete']['$post']
>['json'];
//what kind of request type will we receive i.e. json.

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.categories['bulk-delete']['$post']({
        json
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Categories deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to delete categories');
    }
  });
  return mutation;
};
