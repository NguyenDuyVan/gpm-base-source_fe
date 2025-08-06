export type PaginationType = {
  page: number;
  limit: number;
  totalPages?: number;
  totalItems?: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
};
