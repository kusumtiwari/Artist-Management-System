import { useState, useEffect } from "react";
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

import { useCreateUser, useUpdateUser } from "../../queries/resources";
import { PasswordInput } from "../ui/password-input";
import { DatePicker } from "../ui/date-picker";
import { FrontendErrorHandler } from "../../utils/errorHandler";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "../../schema/user";
import type z from "zod";

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface AddUserDialogProps {
  mode?: "add" | "edit";
  initialValues?: Partial<CreateUserFormValues> & { id?: number };
  onUserCreated?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddUserDialog({
  mode = "add",
  initialValues,
  onUserCreated,
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: AddUserDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const { register, handleSubmit, control, reset, setError, formState: { errors } } =
    useForm<CreateUserFormValues>({
      resolver: zodResolver(createUserSchema),
      defaultValues: {
        first_name: initialValues?.first_name ?? "",
        last_name: initialValues?.last_name ?? "",
        email: initialValues?.email ?? "",
        password: "",
        phone: initialValues?.phone ?? "",
        dob: initialValues?.dob ?? null,
        gender: initialValues?.gender ?? undefined,
        address: initialValues?.address ?? "",
      },
    });

  // Set field errors from API response
  useEffect(() => {
    const error = mode === "edit" ? updateUser.error : createUser.error;
    if (error) {
      const fieldErrors = FrontendErrorHandler.extractFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as keyof CreateUserFormValues, { message });
      });
    }
  }, [createUser.error, updateUser.error, setError, mode]);

  const onSubmit = (values: CreateUserFormValues) => {
    if (mode === "edit" && initialValues?.id) {
      updateUser.mutate(
        { userId: initialValues.id, data: values },
        {
          onSuccess: () => {
            setIsOpen(false);
            reset();
            onUserCreated?.();
          },
        }
      );
      return;
    }

    createUser.mutate(values, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
        onUserCreated?.();
      },
    });
  };

  const isLoading = mode === "edit" ? updateUser.isPending : createUser.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size={2} intent="secondary">
            Add user
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl md:w-225 space-y-2 max-h-[90vh] overflow-auto">
        <DialogHeader className="p-0!">
          <DialogTitle>{mode === "edit" ? "Edit user" : "Add new user"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
          <FormContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="first_name" required>First name</Label>
                <Input
                  {...register("first_name")}
                  placeholder="First name"
                  error={errors.first_name?.message}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="last_name" required>Last name</Label>
                <Input
                  {...register("last_name")}
                  placeholder="Last name"
                  error={errors.last_name?.message}
                />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="email" required>Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Email address"
                  error={errors.email?.message}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password" required={mode === "add"}>Password</Label>
                <PasswordInput
                  {...register("password")}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                />
              </FormGroup>
            </div>

            <div className="border-t pt-4 mt-2 border-text-default-secondary">
              <p className="text-sm font-medium text-text-default-secondary mb-4">
                Additional Information (Optional)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    {...register("phone")}
                    placeholder="Phone number"
                    error={errors.phone?.message}
                  />
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
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  <Input
                    {...register("address")}
                    placeholder="Address"
                    error={errors.address?.message}
                  />
                </FormGroup>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button intent="outline" size={2}>Cancel</Button>
              </DialogClose>
              <Button type="submit" size={2} isLoading={isLoading}>
                {mode === "edit" ? "Update user" : "Save user"}
              </Button>
            </DialogFooter>
          </FormContent>
        </form>
      </DialogContent>
    </Dialog>
  );
}