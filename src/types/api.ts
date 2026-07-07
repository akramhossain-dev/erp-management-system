/**
 * API request/response types.
 * Wraps Supabase responses with standard error handling patterns.
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  column: string;
  direction: "asc" | "desc";
}
