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

import { useCreateArtist, useUpdateArtist } from "../../queries/resources";
import { DatePicker } from "../ui/date-picker";
import { YearPicker } from "../ui/year-picker";
import { FrontendErrorHandler } from "../../utils/errorHandler";

import { zodResolver } from "@hookform/resolvers/zod";
import { createArtistSchema, type CreateArtistFormValues } from "../../schema/artist";

interface AddArtistDialogProps {
  mode?: "add" | "edit";
  initialValues?: CreateArtistFormValues & { id?: number };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function AddArtistDialog({
  mode = "add",
  initialValues,
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: AddArtistDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen;

  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();

  const { register, handleSubmit, control, reset, setError, formState: { errors } } =
    useForm<CreateArtistFormValues>({
      resolver: zodResolver(createArtistSchema),
      defaultValues: {
        name: initialValues?.name ?? "",
        dob: initialValues?.dob ?? null,
        gender: initialValues?.gender ?? undefined,
        address: initialValues?.address ?? "",
        first_release_year: initialValues?.first_release_year ?? undefined,
        no_of_albums_released: initialValues?.no_of_albums_released ?? undefined,
      },
    });

  // Set field errors from API response
  useEffect(() => {
    const error = mode === "edit" ? updateArtist.error : createArtist.error;
    if (error) {
      const fieldErrors = FrontendErrorHandler.extractFieldErrors(error);
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as keyof CreateArtistFormValues, { message });
      });
    }
  }, [createArtist.error, updateArtist.error, setError, mode]);

  const onSubmit = (values: CreateArtistFormValues) => {
    // Convert Date to string for API
    const apiData = {
      ...values,
      dob: values.dob ? (values.dob as any).toISOString().split('T')[0] : undefined,
      first_release_year: values.first_release_year ?? undefined,
      no_of_albums_released: values.no_of_albums_released ?? undefined,
    };

    if (mode === "edit" && initialValues?.id) {
      updateArtist.mutate(
        { artistId: initialValues.id, data: apiData },
        {
          onSuccess: () => {
            setIsOpen(false);
            reset();
          },
        }
      );
      return;
    }

    createArtist.mutate(apiData, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  const isLoading = mode === "edit" ? updateArtist.isPending : createArtist.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size={2} intent="secondary">
            Add artist
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 max-w-xl md:w-225 space-y-2 max-h-[90vh] overflow-auto">
        <DialogHeader className="p-0!">
          <DialogTitle>{mode === "edit" ? "Edit artist" : "Add new artist"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="pt-2">
          <FormContent>
            <FormGroup>
              <Label htmlFor="name" required>
                Name
              </Label>
              <Input
                {...register("name")}
                placeholder="Artist name"
                error={errors.name?.message}
              />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="gender" required>
                  Gender
                </Label>
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

            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input
                {...register("address")}
                placeholder="Artist address"
                error={errors.address?.message}
              />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <Label htmlFor="first_release_year">First Release Year</Label>
                <Controller
                  name="first_release_year"
                  control={control}
                  render={({ field, fieldState }) => (
                    <YearPicker
                      id="first_release_year"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select year"
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      clearable
                    />
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="no_of_albums_released">Albums Released</Label>
                <Input
                  type="number"
                  {...register("no_of_albums_released", { valueAsNumber: true })}
                  placeholder="Number of albums"
                  error={errors.no_of_albums_released?.message}
                />
              </FormGroup>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button intent="outline" size={2}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size={2} isLoading={isLoading}>
                {mode === "edit" ? "Update artist" : "Save artist"}
              </Button>
            </DialogFooter>
          </FormContent>
        </form>
      </DialogContent>
    </Dialog>
  );
}
