import { toast } from "@/hooks/use-toast";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { EditUserForm } from "../data/schema";

export const editUser = async (
  values: EditUserForm,
  userId: string,
  defaultValues: EditUserForm,
  onOpenChange: (open: boolean) => void
) => {
  const { password, ...updatedValues } = values;

  if (password !== "") {
    (updatedValues as EditUserForm).password = password;
  }

  const hasChanges: boolean = Object.keys(updatedValues).some((key) => {
    return (
      updatedValues[key as keyof typeof updatedValues] !==
      defaultValues[key as keyof typeof defaultValues]
    );
  });

  if (!hasChanges) {
    toast({
      title: "No changes detected",
      description: "No changes were made to the user information.",
    });
    onOpenChange(false);
    return null;
  }

  const response = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedValues),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || ERROR_MESSAGES.UPDATE_FAILED);
  }

  return data;
};
