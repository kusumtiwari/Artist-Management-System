import { z } from 'zod';

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name cannot exceed 255 characters"),
  dob: z.date().nullable().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().max(255, "Address cannot exceed 255 characters").optional(),
  first_release_year: z.number().int().min(1900, 'Year must be 1900 or later').max(new Date().getFullYear(), 'Year cannot be in the future').nullable().optional(),
  no_of_albums_released: z.number().int().min(0, 'Cannot be negative').nullable().optional(),
});

export type CreateArtistFormValues = z.infer<typeof createArtistSchema>;