import { z } from "zod";

export const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().min(6, "Username must be at least 6 characters")
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export type UserData = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;