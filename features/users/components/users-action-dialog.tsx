"use client";

import { useState, useEffect } from "react";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, User, UserForm } from "../types/users";
import { InnerFormAction } from "./inner-form-action";
import { useRouter } from "next/navigation";

interface Props {
  currentRow: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const router = useRouter();
  const [userValues, setUserValues] = useState<UserForm>({
    fullName: currentRow.fullName,
    username: currentRow.username,
    email: currentRow.email,
    role: currentRow.role,
    password: "",
    confirmPassword: "",
  });

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: userValues,
  });

  useEffect(() => {
    form.reset(userValues);
  }, [userValues, form]);

  const onSubmit = async (values: UserForm) => {
    const { password, ...updatedValues } = values;

    if (password !== "") {
      (updatedValues as UserForm).password = password;
    }

    const hasChanges: boolean = Object.keys(updatedValues).some((key) => {
      return (
        updatedValues[key as keyof typeof updatedValues] !==
        userValues[key as keyof typeof userValues]
      );
    });

    if (!hasChanges) {
      toast({
        title: "No changes detected",
        description: "No changes were made to the user information.",
      });
      onOpenChange(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${currentRow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update user: ${errorData.error}`);
      }

      const updatedUser = await response.json();
      setUserValues(updatedUser.data);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      onOpenChange(false);
      form.reset(updatedUser.data);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Update failed",
          description: `Failed to update user: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset(userValues);
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
          <Form {...form}>
            <InnerFormAction handleSubmit={onSubmit} />
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form="user-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
