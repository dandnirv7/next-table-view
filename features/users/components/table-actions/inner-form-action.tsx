"use client";
import { PasswordInput } from "@/components/password-input";
import { SelectDropdown } from "@/components/select-dropdown";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { userTypes } from "@/features/users/data/data";
import { AddUserForm, EditUserForm } from "@/features/users/data/schema";

type InnerFormActionProps = {
  handleSubmit: (values: EditUserForm | AddUserForm) => void;
};

export const InnerFormAction = ({ handleSubmit }: InnerFormActionProps) => {
  const form = useFormContext<EditUserForm | AddUserForm>();
  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <form
      id="user-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-4 p-0.5"
    >
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">Full Name</FormLabel>
            <FormControl>
              <Input placeholder="john_doe" className="col-span-4" {...field} />
            </FormControl>
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">Username</FormLabel>
            <FormControl>
              <Input placeholder="john_doe" className="col-span-4" {...field} />
            </FormControl>
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">Email</FormLabel>
            <FormControl>
              <Input
                placeholder="john.doe@gmail.com"
                className="col-span-4"
                {...field}
              />
            </FormControl>
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">Role</FormLabel>
            <SelectDropdown
              defaultValue={field.value}
              onValueChange={field.onChange}
              placeholder="Select a role"
              className="col-span-4"
              items={userTypes.map(({ label, value }) => ({
                label,
                value,
              }))}
            />
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">Password</FormLabel>
            <FormControl>
              <PasswordInput
                placeholder="e.g., S3cur3P@ssw0rd"
                className="col-span-4"
                {...field}
              />
            </FormControl>
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="grid items-center grid-cols-6 space-y-0 gap-x-4 gap-y-1">
            <FormLabel className="col-span-2 text-right">
              Confirm Password
            </FormLabel>
            <FormControl>
              <PasswordInput
                disabled={!isPasswordTouched}
                placeholder="e.g., S3cur3P@ssw0rd"
                className="col-span-4"
                {...field}
              />
            </FormControl>
            <FormMessage className="col-span-4 col-start-3" />
          </FormItem>
        )}
      />
    </form>
  );
};
