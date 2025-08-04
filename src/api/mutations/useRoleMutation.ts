import { Role } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appPoster, appDeleter, appPatchter } from "../fetcher";
import { ROLES_PATH } from "../apiPaths";
import { ROLES_QUERY_KEY } from "../queries/useRoleQuery";

// Create role mutation
export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      roleData: Omit<Role, "id" | "rolePermissions" | "createdAt" | "updatedAt">
    ): Promise<Role> => {
      const response = await appPoster<Role>(ROLES_PATH, roleData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch roles query
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
};

// Update role mutation
export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...roleData
    }: Partial<Role> & { id: number }): Promise<Role> => {
      return await appPatchter<Role>(`${ROLES_PATH}/${id}`, roleData);
    },
    onSuccess: () => {
      // Invalidate and refetch roles query
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
};

// Delete role mutation
export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await appDeleter(`${ROLES_PATH}/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch roles query
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
};

// Assign permissions to role mutation
export const useAssignPermissionsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => {
      const response = await appPoster(
        `${ROLES_PATH}/assign-permissions/${roleId}`,
        {
          permission_ids: permissionIds,
        }
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch roles query
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
};
