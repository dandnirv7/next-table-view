import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useTransition } from "react";
import { statusTypes, userTypes } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { useTableFilters } from "./use-table-filters";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const {
    setSearchQuery,
    searchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    isAnyFilterActive,
    resetFilters,
  } = useTableFilters();

  const [, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearchQuery(value, { startTransition });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col-reverse items-start flex-1 gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter users..."
          value={searchQuery ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              title="Status"
              options={statusTypes.map((t) => ({ ...t }))}
              setFilterValue={setStatusFilter}
              filterValue={statusFilter}
            />
          )}
          {table.getColumn("role") && (
            <DataTableFacetedFilter
              title="Role"
              options={userTypes.map((t) => ({ ...t }))}
              setFilterValue={setRoleFilter}
              filterValue={roleFilter}
            />
          )}
        </div>
        {isAnyFilterActive && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
