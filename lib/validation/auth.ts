import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim()
    .max(254, "Email address is too long.")
    .email("Please enter a valid email address.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Please enter your password.").max(1024),
}).strict();

export type LoginInput = z.output<typeof loginSchema>;
