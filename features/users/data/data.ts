import { IconShield, IconUser, IconUserShield } from "@tabler/icons-react";
import { UserStatus } from "./schema";

export const callTypes = new Map<UserStatus, string>([
  ["active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["inactive", "bg-neutral-300/40 border-neutral-300"],
]);

export const statusTypes = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

export const userTypes = [
  {
    label: "Super Admin",
    value: "super admin",
    icon: IconShield,
  },
  {
    label: "Admin",
    value: "admin",
    icon: IconUserShield,
  },
  {
    label: "User",
    value: "user",
    icon: IconUser,
  },
] as const;
