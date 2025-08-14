export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  address?: string;
  phoneNumber?: string;
  taxCode?: string;
  roleId?: number | null;
  isActive: boolean;
  isSuperAdmin: boolean;
  metaData?: any;
  refreshToken?: string;
  role?: {
    id: number;
    name: string;
  } | null;
  permissions?: {
    id: number;
    apiPath: string;
    method: string;
  }[];
  lang?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedAt?: string | null;
  deletedBy?: number | null;
  deleted: boolean;
}

export interface Permission {
  id: number;
  apiPath: string;
  method: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  rolePermissions: RolePermission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  createdAt?: string;
}
