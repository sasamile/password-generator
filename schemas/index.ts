import { z } from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  numberCard: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1, { message: "Password is required" }),
  urlWebsite: z.string().optional(),
  notes: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim(),
  password: z.string().min(1).trim(),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim(),
  password: z.string().min(1).trim(),
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .trim(),
});
