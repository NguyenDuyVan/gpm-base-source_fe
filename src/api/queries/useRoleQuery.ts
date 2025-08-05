import { Role, Permission } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { appFetcher } from "../fetcher";
import { ROLES_PATH } from "../apiPaths";

// Role query keys
export const ROLES_QUERY_KEY = ["roles"] as const;
export const ROLE_BY_ID_QUERY_KEY = (id: string | number) =>
  ["roles", id] as const;
export const PERMISSIONS_QUERY_KEY = ["permissions"] as const;

// Get all roles query
export const useRolesQuery = () => {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: async (): Promise<Role[]> => {
      const response = await appFetcher<Role[]>(ROLES_PATH, {
        requireAuth: true,
      });
      return response;
    },
  });
};

// Get role by ID query
export const useRoleByIdQuery = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ROLE_BY_ID_QUERY_KEY(id),
    queryFn: async (): Promise<Role> => {
      const response = await appFetcher<Role>(`${ROLES_PATH}/${id}`, {
        requireAuth: true,
      });
      return response;
    },
    enabled: enabled && !!id,
  });
};

// Get permissions query (for binding roles to permissions)
export const usePermissionsQuery = () => {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: async (): Promise<Permission[]> => {
      const response = await appFetcher<Permission[]>("/v1/permissions", {
        requireAuth: true,
      });
      return response;
    },
  });
};

// Custom hook to get roles with their permissions
export const useRolesWithPermissionsQuery = () => {
  const rolesQuery = useRolesQuery();
  const permissionsQuery = usePermissionsQuery();

  return {
    ...rolesQuery,
    data: rolesQuery.data
      ? {
          roles: rolesQuery.data,
          permissions: permissionsQuery.data || [],
          isPermissionsLoading: permissionsQuery.isLoading,
          permissionsError: permissionsQuery.error,
        }
      : undefined,
    isLoading: rolesQuery.isLoading || permissionsQuery.isLoading,
    error: rolesQuery.error || permissionsQuery.error,
  };
};
