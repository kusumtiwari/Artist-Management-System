"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { FormContent, FormGroup } from "../ui/form";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useCreateUser } from "../../queries/resources";
import { PasswordInput } from "../ui/password-input";
import { DatePicker } from "../ui/date-picker";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "../../schema/user";
import type z from "zod";

type CreateUserFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: Date | null;
  gender?: string;
  address?: string;
};

interface AddUserDialogProps {
  onUserCreated?: () => void;
}

export function AddUserDialog({ onUserCreated }: AddUserDialogProps) {
  const form = useForm<z.infer<typeof createUserSchema>>({
  resolver: zodResolver(createUserSchema),
  defaultValues: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: null,
    gender: undefined,
    address: "",
  },
});


  const [isOpen, setIsOpen] = useState(false);
  const createUser = useCreateUser();

  const { register, handleSubmit, control, reset } =
    useForm<CreateUserFormValues>({
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        dob: null,
        gender: undefined,
        address: "",
      },
    });

  const onSubmit = (values: CreateUserFormValues) => {
    createUser.mutate(values, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
        onUserCreated?.();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={2} intent="secondary">
          Add user
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl md:w-[900px] space-y-2 max-h-[90vh] overflow-auto">
        <DialogHeader className="!p-0">
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
          <FormContent>
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="first_name" required>
                  First name{" "}
                </Label>
                <Input
                  {...register("first_name", { required: true })}
                  placeholder="First name"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="last_name" required>
                  Last name{" "}
                </Label>
                <Input
                  {...register("last_name", { required: true })}
                  placeholder="Last name"
                />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="email" required>
                  Email{" "}
                </Label>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email address"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password" required>
                  Password
                </Label>
                <PasswordInput
                  {...register("password")}
                  placeholder="Enter your password"
                />
              </FormGroup>
            </div>

            {/* Optional Section */}
            <div className="border-t pt-4 mt-2 border-text-default-secondary">
              <p className="text-sm font-medium text-default-secondary mb-4">
                Additional Information (Optional)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup>
                  <Label htmlFor="phone">Phone</Label>
                  <Input {...register("phone")} placeholder="Phone number" />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="dob">Date of Birth</Label>

                  <Controller
                    name="dob"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        id="dob"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select date"
                        className="h-11 w-full bg-transparent"
                        iconAlign="right"
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        clearable
                      />
                    )}
                  />
                </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>

                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger fullWidth>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input {...register("address")} placeholder="Address" />
                </FormGroup>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end ">
              <DialogClose asChild>
                <Button intent="outline" size={2}>
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" size={2} isLoading={createUser.isPending}>
                Save user
              </Button>
            </DialogFooter>
          </FormContent>
        </form>
      </DialogContent>
    </Dialog>
  );
}
