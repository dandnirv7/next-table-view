"use client";

import { searchParams } from "@/lib/search-params";
import { PaginationState } from "@tanstack/react-table";
import { useQueryState } from "nuqs";

type UseTablePaginationProps = {
  totalItems: number;
  defaultPageSize?: number;
  defaultPage?: number;
};

export function useTablePagination({
  totalItems,
  defaultPageSize = 10,
  defaultPage = 1,
}: UseTablePaginationProps) {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    searchParams.page
      .withOptions({
        shallow: false,
      })
      .withDefault(defaultPage)
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    searchParams.limit
      .withOptions({ shallow: false, throttleMs: 500 })
      .withDefault(defaultPageSize)
  );

  const paginationState = {
    pageIndex: currentPage - 1,
    pageSize,
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((prevState: PaginationState) => PaginationState)
  ) => {
    const newPaginationState =
      typeof updaterOrValue === "function"
        ? updaterOrValue({
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
          })
        : updaterOrValue;

    setCurrentPage(newPaginationState.pageIndex + 1);
    setPageSize(newPaginationState.pageSize);
  };

  return {
    currentPage,
    pageSize,
    paginationState,
    pageCount,
    handlePaginationChange,
  };
}
