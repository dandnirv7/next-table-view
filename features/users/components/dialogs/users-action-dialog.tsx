"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AddUserForm,
  addUserSchema,
  EditUserForm,
  editUserSchema,
} from "@/features/users/data/schema";
import { addUser } from "@/features/users/utils/addUser";
import { editUser } from "@/features/users/utils/editUser";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { InnerFormAction } from "../table-actions/inner-form-action";

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const router = useRouter();

  const isEdit = !!currentRow;
  const formSchema = isEdit ? editUserSchema : addUserSchema;
  const [isPending, startTransition] = useTransition();

  const initialDefaultValues = isEdit
    ? {
        ...currentRow,
        password: "",
        confirmPassword: "",
        isEdit,
      }
    : {
        fullName: "",
        username: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
        isEdit,
      };

  const form = useForm<AddUserForm | EditUserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: initialDefaultValues,
  });

  const onSubmit = (values: EditUserForm | AddUserForm) => {
    startTransition(async () => {
      try {
        if (isEdit) {
          const result = await editUser(
            values as EditUserForm,
            currentRow!.id,
            initialDefaultValues,
            onOpenChange
          );

          if (!result) {
            return;
          }
        } else {
          await addUser(values as AddUserForm);
        }

        form.reset();
        toast({
          title: isEdit
            ? "User updated successfully!"
            : "User added successfully!",
          description: isEdit
            ? "The user information has been successfully updated."
            : "A new user has been successfully added.",
        });

        onOpenChange(false);
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(ERROR_MESSAGES.CREATE_FAILED);
        }
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user here. " : "Create new user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[26.25rem] w-full pr-4 -mr-4 py-1">
          <Form {...form}>
            <InnerFormAction handleSubmit={onSubmit} />
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form="user-form"
            className={`${isPending ? "opacity-50" : "opacity-100"}`}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
