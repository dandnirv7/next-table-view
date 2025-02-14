import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { AddUserForm } from "../types/users";

export const addUser = async (values: AddUserForm) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || ERROR_MESSAGES.CREATE_FAILED);
  }

  return data;
};
