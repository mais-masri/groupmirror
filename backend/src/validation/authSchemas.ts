import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1).optional(),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const CreateMoodSchema = z.object({
  body: z.object({
    value: z.number().min(1).max(5),
    note: z.string().optional(),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type CreateMoodInput = z.infer<typeof CreateMoodSchema>["body"];

