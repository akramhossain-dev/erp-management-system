import { useState } from "react";
import { PAGINATION_DEFAULTS } from "@/utils/constants";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  reset: () => void;
  /** Calculate offset for Supabase queries */
  offset: number;
}

/**
 * usePagination — manages table pagination state.
 * Integrates with Supabase's range() query for server-side pagination.
 *
 * @example
 * const { page, pageSize, offset, setPage, setPageSize } = usePagination();
 * // In service: .range(offset, offset + pageSize - 1)
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const {
    initialPage = PAGINATION_DEFAULTS.PAGE,
    initialPageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setPage = (newPage: number) => {
    if (newPage >= 1) setPageState(newPage);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageState(1); // Reset to first page when changing page size
  };

  const nextPage = () => setPage(page + 1);
  const previousPage = () => setPage(Math.max(1, page - 1));
  const reset = () => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
  };

  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    reset,
    offset,
  };
}
