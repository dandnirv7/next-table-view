"use client";

import React, { createContext, useState } from "react";
import { User } from "../types/users";
import useDialogState from "@/hooks/use-dialog-state";

type UsersDialogType = "add" | "edit" | "delete" | "change-status";

interface UsersContextType {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
  newStatus: string | null;
  setNewStatus: (status: string | null) => void;
}

const UsersContext = createContext<UsersContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function UsersProviders({ children }: Props) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  return (
    <UsersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        newStatus,
        setNewStatus,
      }}
    >
      {children}
    </UsersContext>
  );
}

export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error("useUsers has to be used within <UsersContext>");
  }

  return usersContext;
};
