import { Button } from "@/components/ui/button";
import { IconDownload, IconUserPlus } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { useUsers } from "../context/users";
import { DataTableViewOptions } from "./data-table-view-options";
import { exportTableToCSV } from "./export";

interface TabletoolbarActionsProps<TData> {
  table: Table<TData>;
}

const TableToolbarActions = <TData,>({
  table,
}: TabletoolbarActionsProps<TData>) => {
  const { setOpen } = useUsers();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => setOpen("add")}
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <IconUserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "users",
            excludeColumns: ["select", "actions"],
          })
        }
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <IconDownload className="mr-2 h-4 w-4" />
        Export
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  );
};

export default TableToolbarActions;
