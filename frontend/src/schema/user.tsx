import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  phone: z.string().optional(),

  dob: z.date().nullable().optional(),

  gender: z.string().optional(),

  address: z.string().optional(),
});