//hook
import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono'; //give us access to the api routes

type ResponseType = InferResponseType<(typeof client.api.categories)[':id']['$patch']>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[':id']['$patch']
>['json']; //what kind of request type will we receive i.e. json.

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.categories[':id']['$patch']({
        json,
        param: { id }
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category updated');
      queryClient.invalidateQueries({ queryKey: ['category', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      //TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to edit category');
    }
  });
  return mutation;
};
