"use client";

import { searchParams } from "@/lib/search-params";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [roleFilter, setRoleFilter] = useQueryState(
    "role",
    searchParams.role.withOptions({ shallow: false }).withDefault("")
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter("");
    setRoleFilter("");
    setPage(1);
  }, [setSearchQuery, setStatusFilter, setRoleFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter || !!roleFilter;
  }, [searchQuery, statusFilter, roleFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    resetFilters,
    isAnyFilterActive,
  };
}
