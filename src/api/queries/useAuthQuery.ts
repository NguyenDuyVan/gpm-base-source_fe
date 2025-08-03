import { User } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { appFetcher } from "../fetcher";
import { AUTH_PATH_CURRENT_USER } from "../apiPaths";

// Get current user query
export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async (): Promise<User> => {
      return appFetcher<User>(AUTH_PATH_CURRENT_USER, {
        requireAuth: true,
      });
    },
  });
};
