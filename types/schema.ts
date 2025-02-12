import { z } from "zod";

const regexLowercase = /[a-z]/;
const regexUppercase = /[A-Z]/;
const regexDigit = /\d/;
const regexSpecialChar = /[@$!%*?&]/;

export const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  fullName: z
    .string()
    .min(2, { message: "Fullname must be at least 2 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((value) => regexLowercase.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => regexUppercase.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => regexDigit.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => regexSpecialChar.test(value), {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["super admin", "admin", "user"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UserData = z.infer<typeof UserSchema>;
