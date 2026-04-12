// schema/user.ts
import { z } from "zod"

const baseUserSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
  phone: z.string().optional(),
  dob: z.date().nullable().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
})

export const createUserSchema = baseUserSchema.refine(
  (data) => !!data.password && data.password.length >= 6,
  { message: "Password must be at least 6 characters", path: ["password"] }
)

export const updateUserSchema = baseUserSchema.refine(
  (data) => !data.password || data.password.length >= 6,
  { message: "Password must be at least 6 characters", path: ["password"] }
)

// schema/user.ts
export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>