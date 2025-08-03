export type PaginationType = {
  page: number;
  size: number;
  total?: number;
  search?: string;
  order?: "ASC" | "DESC";
  sortBy?: string;
};
