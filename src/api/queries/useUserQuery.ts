import { User } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  appFetcher,
  appPaginationFetcher,
  ResponsePagination,
} from "../fetcher";
import { USERS_PATH, USERS_PATH_BY_ID } from "../apiPaths";
import { PaginationType } from "@/types/pagination";

// User query keys
export const USERS_QUERY_KEY = ["users"] as const;
export const USER_BY_ID_QUERY_KEY = (id: string | number) =>
  ["users", id] as const;

// Get all users query with pagination, sorting, filtering
export const useUsersQuery = (params?: PaginationType) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: async (): Promise<ResponsePagination<User>["data"]> => {
      return await appPaginationFetcher<User>(USERS_PATH, params);
    },
  });
};

// Get user by ID query
export const useUserByIdQuery = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: USER_BY_ID_QUERY_KEY(id),
    queryFn: async (): Promise<User> => {
      const response = await appFetcher<User>(USERS_PATH_BY_ID(id), {
        requireAuth: true,
      });
      return response;
    },
    enabled: enabled && !!id,
  });
};
