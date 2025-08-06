import { Role, Permission } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import {
  appFetcher,
  appPaginationFetcher,
  ResponsePagination,
} from "../fetcher";
import { ROLES_PATH } from "../apiPaths";
import { PaginationType } from "@/types/pagination";

export const ROLES_QUERY_KEY = ["roles"] as const;
export const ROLE_BY_ID_QUERY_KEY = (id: string | number) =>
  ["roles", id] as const;
export const PERMISSIONS_QUERY_KEY = ["permissions"] as const;

export const useRolesQuery = (params?: PaginationType) => {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, params],
    queryFn: async (): Promise<ResponsePagination<Role>["data"]> => {
      return await appPaginationFetcher<Role>(ROLES_PATH, params);
    },
  });
};

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

export const useRolesWithPermissionsQuery = () => {
  const rolesQuery = useRolesQuery();
  const permissionsQuery = usePermissionsQuery();

  return {
    ...rolesQuery,
    data: rolesQuery.data?.data
      ? {
          roles: rolesQuery.data.data,
          permissions: permissionsQuery.data || [],
          isPermissionsLoading: permissionsQuery.isLoading,
          permissionsError: permissionsQuery.error,
        }
      : undefined,
    isLoading: rolesQuery.isLoading || permissionsQuery.isLoading,
    error: rolesQuery.error || permissionsQuery.error,
  };
};
