"use client";

import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { User } from "../types/users";
import { useRouter } from "next/navigation";
import { ERROR_MESSAGES } from "@/utils/errorMessage";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (value.trim() !== currentRow.username) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/sers/${currentRow.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          title: "Deletion Failed",
          description: `Failed to delete user with username: ${currentRow.username}.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "The following user has been deleted:",
        description: `The account with username ${currentRow.username} (${currentRow.fullName}) has been successfully deleted.`,
      });

      router.refresh();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Deletion Error",
          description: ERROR_MESSAGES.DELETE_FAILED,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.username}</span>?
            <br />
            This action will permanently remove the user with the role of{" "}
            <span className="font-bold">
              {currentRow.role.toUpperCase()}
            </span>{" "}
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
      }
      confirmText="Delete"
      destructive
      isLoading={isLoading}
    />
  );
}
