import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(4, { message: "Username must be a least 4 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be a least 6 characters" }),
});

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is not valid" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be a least 6 characters" }),
});
