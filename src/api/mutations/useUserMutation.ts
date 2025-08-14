import { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appPoster, appDeleter, appPatchter } from "../fetcher";
import { USERS_PATH, USERS_PATH_UPDATE_LANGUAGE } from "../apiPaths";
import { USERS_QUERY_KEY } from "../queries/useUserQuery";
import { ACCOUNT_QUERY_KEY } from "../queries/useAuthQuery";

// Create user mutation
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber?: string;
      address?: string;
      taxCode?: string;
      roleId?: number | null;
      isActive: boolean;
      isSuperAdmin?: boolean;
    }): Promise<User> => {
      const response = await appPoster<User>(USERS_PATH, userData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

// Update user mutation
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...userData
    }: Partial<User> & { id: number }): Promise<User> => {
      return await appPatchter<User>(`${USERS_PATH}/${id}`, userData);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

// Delete user mutation
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await appDeleter(`${USERS_PATH}/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

// Update user language mutation
export const useUpdateLanguageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lang: string): Promise<User> => {
      return await appPatchter<User>(USERS_PATH_UPDATE_LANGUAGE, { lang });
    },
    onSuccess: () => {
      // Invalidate and refetch account query to update user profile
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
  });
};
