import { Blog } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  appFetcher,
  appPaginationFetcher,
  ResponsePagination,
} from "../fetcher";
import { BLOGS_PATH, BLOGS_PATH_BY_ID, BLOGS_PATH_BY_SLUG } from "../apiPaths";
import { PaginationType } from "@/types/pagination";
// Blog query keys
export const BLOGS_QUERY_KEY = ["blogs"] as const;
export const BLOG_BY_ID_QUERY_KEY = (id: string | number) =>
  ["blogs", id] as const;
export const BLOG_BY_SLUG_QUERY_KEY = (slug: string) =>
  ["blogs", "slug", slug] as const;

export const useBlogsQuery = (params?: PaginationType) => {
  return useQuery({
    queryKey: [...BLOGS_QUERY_KEY, params],
    queryFn: async (): Promise<ResponsePagination<Blog>["data"]> => {
      return await appPaginationFetcher<Blog>(BLOGS_PATH, params);
    },
  });
};

// Get blog by ID query
export const useBlogByIdQuery = (id: string | number) => {
  return useQuery({
    queryKey: BLOG_BY_ID_QUERY_KEY(id),
    queryFn: async (): Promise<Blog> => {
      return await appFetcher<Blog>(BLOGS_PATH_BY_ID(id), {
        requireAuth: true,
      });
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
};

// Get blog by slug query
export const useBlogBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: BLOG_BY_SLUG_QUERY_KEY(slug),
    queryFn: async (): Promise<Blog> => {
      const response = await appFetcher<Blog>(BLOGS_PATH_BY_SLUG(slug), {
        requireAuth: true,
      });
      return response;
    },
    enabled: !!slug, // Only run the query if a slug is provided
  });
};
