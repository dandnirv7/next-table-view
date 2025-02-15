import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/context/users-context";
import { exportTableToCSV } from "@/features/users/utils/exportTable";
import { IconDownload, IconUserPlus } from "@tabler/icons-react";
import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "../data-table/data-table-view-options";

interface TabletoolbarActionsProps<TData> {
  table: Table<TData>;
}

const TableToolbarActions = <TData,>({
  table,
}: TabletoolbarActionsProps<TData>) => {
  const { setOpen } = useUsers();

  return (
    <div className="flex flex-row gap-2 ">
      <Button
        variant="outline"
        onClick={() => setOpen("add")}
        size="sm"
        className="flex w-full h-8 ml-auto"
      >
        <IconUserPlus className="w-4 h-4 mr-2" />
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
        className="w-full h-8 ml-auto "
      >
        <IconDownload className="w-4 h-4 mr-2" />
        Export
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  );
};

export default TableToolbarActions;
