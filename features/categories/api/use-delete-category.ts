//hook
import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<(typeof client.api.categories)[':id']['$delete']>;

//what kind of request type will we receive i.e. json.

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async json => {
      const response = await client.api.categories[':id']['$delete']({
        param: { id }
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['category', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      //TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to delete category');
    }
  });
  return mutation;
};
