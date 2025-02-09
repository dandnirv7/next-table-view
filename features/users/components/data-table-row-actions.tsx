import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { IconAlertTriangle, IconEdit, IconTrash } from "@tabler/icons-react";
import { ChangeEvent, useCallback, useState } from "react";
import { User } from "../data/schema";
import { UsersActionDialog } from "./users-action-dialog";

interface DataTableRowActionsProps {
  row: User;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [state, setState] = useState({
    open: false,
    value: "",
    disabled: true,
    editDialogOpen: false,
  });
  const { open, value, disabled, editDialogOpen } = state;

  const debouncedValue = useDebounce(value, 300);
  const currentUser = row.username;

  const { toast } = useToast();

  const handleDelete = useCallback(() => {
    if (debouncedValue.trim() !== currentUser) return;

    toast({
      title: "The following user has been deleted:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(row, null, 2)}</code>
        </pre>
      ),
    });
    setState((prevState) => ({
      ...prevState,
      open: false,
      value: "",
      disabled: true,
    }));
  }, [debouncedValue, currentUser, row, toast]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setState((prevState) => ({
      ...prevState,
      value: inputValue,
      disabled: inputValue !== currentUser,
    }));
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open menu"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() =>
              setState((prevState) => ({ ...prevState, editDialogOpen: true }))
            }
          >
            Edit
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              setState((prevState) => ({ ...prevState, open: true }))
            }
            className="!text-red-500"
          >
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={open}
        onOpenChange={(isOpen) =>
          setState((prevState) => ({ ...prevState, open: isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle>
              <span className="text-destructive">
                <IconAlertTriangle
                  className="mr-1 inline-block stroke-destructive"
                  size={18}
                />
                Delete User
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p className="mb-2">
                  Are you sure you want to delete{" "}
                  <span className="font-bold">{row.username}</span>?
                  <br />
                  This action will permanently remove the user with the role of{" "}
                  <span className="font-bold">
                    {row.role.toUpperCase()}
                  </span>{" "}
                  from the system. This cannot be undone.
                </p>
                <Label className="my-2">
                  Username:
                  <Input
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Enter username to confirm deletion."
                  />
                </Label>
                <Alert variant="destructive">
                  <AlertTitle>Warning!</AlertTitle>
                  <AlertDescription>
                    Please be careful, this operation cannot be rolled back.
                  </AlertDescription>
                </Alert>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              disabled={disabled}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <UsersActionDialog
        open={editDialogOpen}
        onOpenChange={(isOpen) =>
          setState((prevState) => ({ ...prevState, editDialogOpen: isOpen }))
        }
        currentRow={row}
      />
    </>
  );
}
