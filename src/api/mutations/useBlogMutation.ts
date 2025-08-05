import { Blog } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appPoster, appDeleter, appPatchter } from "../fetcher";
import { BLOGS_PATH, BLOGS_PATH_BY_ID } from "../apiPaths";
import { BLOGS_QUERY_KEY } from "../queries/useBlogQuery";

// Interface for blog creation
export interface CreateBlogRequest {
  title: string;
  slug: string;
  description: string;
}

// Create blog mutation
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogData: CreateBlogRequest): Promise<Blog> => {
      const response = await appPoster<Blog>(BLOGS_PATH, blogData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch blogs query
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });
};

// Update blog mutation
export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...blogData
    }: Partial<CreateBlogRequest> & { id: number }): Promise<Blog> => {
      return await appPatchter<Blog>(BLOGS_PATH_BY_ID(id), blogData);
    },
    onSuccess: () => {
      // Invalidate and refetch blogs query
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });
};

// Delete blog mutation
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await appDeleter(BLOGS_PATH_BY_ID(id));
    },
    onSuccess: () => {
      // Invalidate and refetch blogs query
      queryClient.invalidateQueries({ queryKey: BLOGS_QUERY_KEY });
    },
  });
};
