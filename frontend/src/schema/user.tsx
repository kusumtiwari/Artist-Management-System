import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(255, "First name cannot exceed 255 characters"),
  last_name: z.string().min(1, "Last name is required").max(255, "Last name cannot exceed 255 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email").max(255, "Email cannot exceed 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(500, "Password cannot exceed 500 characters"),

  phone: z.string().regex(/^[+]?[0-9]*$/, "Phone can only contain digits and +").max(20, "Phone cannot exceed 20 characters").optional().or(z.literal("")),

  dob: z.date().nullable().optional(),

  gender: z.string().optional(),

  address: z.string().max(255, "Address cannot exceed 255 characters").optional(),
});