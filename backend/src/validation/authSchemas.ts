import { z } from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 chars"),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(6, "Password must be at least 6 chars"),
  }),
});

export const CreateMoodSchema = z.object({
  body: z.object({
    value: z.number().min(1).max(5),
    note: z.string().optional(),
  }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>["body"];
export type LoginInput = z.infer<typeof LoginSchema>["body"];
export type CreateMoodInput = z.infer<typeof CreateMoodSchema>["body"];

