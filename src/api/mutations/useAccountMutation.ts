import { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appPatchter } from "../fetcher";
import { USERS_PATH_BY_ID, USERS_PATH_CHANGE_PASSWORD } from "../apiPaths";
import {
  ACCOUNT_QUERY_KEY,
  CURRENT_USER_QUERY_KEY,
} from "../queries/useAuthQuery";

// Interface for account update data
export interface AccountUpdateData {
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  taxCode?: string;
  isActive?: boolean;
}

// Interface for password update data
export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Update account details mutation
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...accountData
    }: AccountUpdateData & { id: number }): Promise<User> => {
      return await appPatchter<User>(USERS_PATH_BY_ID(id), accountData);
    },
    onSuccess: () => {
      // Invalidate and refetch account queries
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    retry: false,
  });
};

// Update password mutation
export const useUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passwordData: PasswordUpdateData): Promise<User> => {
      return await appPatchter<User>(USERS_PATH_CHANGE_PASSWORD, passwordData);
    },
    onSuccess: () => {
      // Invalidate and refetch account queries
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    retry: false,
  });
};

// Combined mutation for updating both account details and password
export const useUpdateAccountAndPasswordMutation = () => {
  const queryClient = useQueryClient();
  const updateAccount = useUpdateAccountMutation();
  const updatePassword = useUpdatePasswordMutation();

  return useMutation({
    mutationFn: async (data: {
      accountData: AccountUpdateData & { id: number };
      passwordData: PasswordUpdateData;
    }): Promise<any> => {
      // Update account details first
      await updateAccount.mutateAsync(data.accountData);
      // Then update password
      return await updatePassword.mutateAsync(data.passwordData);
    },
    onSuccess: () => {
      // Invalidate and refetch account queries
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    retry: false,
  });
};
