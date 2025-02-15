import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { statusTypes, userTypes } from "@/features/users/data/data";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useTransition } from "react";
import TableToolbarActions from "../table-actions/table-toolbar-actions";
import { useTableFilters } from "../use-table-filters";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

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
    <div className="flex flex-col justify-between gap-4 md:items-center md:flex-row">
      <div className="flex flex-col-reverse items-end justify-end flex-1 md:justify-start gap-y-2 sm:flex-row sm:space-x-2">
        <Input
          placeholder="Filter users..."
          value={searchQuery ?? ""}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-[200px] lg:w-[250px]"
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
      <TableToolbarActions table={table} />
    </div>
  );
}
