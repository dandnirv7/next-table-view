import { z } from "zod";

export type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  status: "active" | "inactive";
};

export type GetUsersResponse = {
  status: boolean;
  data: {
    users: User[];
    limit: number;
    total_users: number;
    total_pages: number;
    current_page: number;
    message: string;
  };
};

export const formSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full Name is required." }),
    username: z.string().min(1, { message: "Username is required." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Email is invalid." }),
    password: z
      .string()
      .optional()
      .transform((pwd) => (pwd ?? "").trim()),

    role: z.string().min(1, { message: "Role is required." }),
    confirmPassword: z
      .string()
      .optional()
      .transform((pwd) => (pwd ?? "").trim()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password && password !== "") {
      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters long.",
          path: ["password"],
        });
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter.",
          path: ["password"],
        });
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number.",
          path: ["password"],
        });
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UserForm = z.infer<typeof formSchema>;
