"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUsers } from "@/features/users/context/users-context";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

export function UsersStatusChangeDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const router = useRouter();
  const { newStatus } = useUsers();

  const [isPending, startTransition] = useTransition();

  const handleChangeStatus = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/users/${currentRow.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update status");
        }

        toast({
          title: "Status Changed",
          description: `The status of user ${currentRow.username} (${currentRow.fullName}) has been successfully updated.`,
        });

        router.refresh();
        onOpenChange(false);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Status Change Error",
            description: ERROR_MESSAGES.UPDATE_FAILED,
            variant: "destructive",
          });
        }
      }
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleChangeStatus}
      title={
        <span className="text-yellow-500">
          <IconAlertTriangle
            className="inline-block mr-1 stroke-yellow-500"
            size={18}
          />{" "}
          Change User Status
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to change the status of{" "}
            <span className="font-bold">{currentRow.username}</span>? This
            action will update the status of the user to{" "}
            <span className="font-bold uppercase">{newStatus}</span> in the
            system.
          </p>

          <Alert variant="warning">
            <AlertTitle>Attention!</AlertTitle>
            <AlertDescription>
              Please ensure you want to change the status, as this operation
              will update the user&apos;s details.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isPending ? "Updating Status..." : "Change Status"}
      isLoading={isPending}
    />
  );
}
