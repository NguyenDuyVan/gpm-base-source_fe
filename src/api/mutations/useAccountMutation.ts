import { User } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appPatchter } from "../fetcher";
import { USERS_PATH_BY_ID, USERS_PATH_CHANGE_PASSWORD } from "../apiPaths";
import { ACCOUNT_QUERY_KEY } from "../queries/useAuthQuery";

export interface AccountUpdateData {
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  taxCode?: string;
  isActive?: boolean;
}

export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
    retry: false,
  });
};

export const useUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passwordData: PasswordUpdateData): Promise<User> => {
      return await appPatchter<User>(USERS_PATH_CHANGE_PASSWORD, passwordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
    retry: false,
  });
};

export const useUpdateAccountAndPasswordMutation = () => {
  const queryClient = useQueryClient();
  const updateAccount = useUpdateAccountMutation();
  const updatePassword = useUpdatePasswordMutation();

  return useMutation({
    mutationFn: async (data: {
      accountData: AccountUpdateData & { id: number };
      passwordData: PasswordUpdateData;
    }): Promise<any> => {
      await updateAccount.mutateAsync(data.accountData);
      return await updatePassword.mutateAsync(data.passwordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_QUERY_KEY });
    },
    retry: false,
  });
};
