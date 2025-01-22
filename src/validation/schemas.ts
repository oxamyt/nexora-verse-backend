import { z } from "zod";

const userSignupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(15, { message: "Username must not exceed 15 characters." }),
    password: z
      .string()
      .trim()
      .min(3, { message: "Password must be at least 3 characters long." })
      .max(30, { message: "Username must not exceed 30 characters." }),
    confirm: z.string().trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type userSignUpSchema = z.infer<typeof userSignupSchema>;

const userLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(15, { message: "Username must not exceed 15 characters." }),
  password: z
    .string()
    .trim()
    .min(3, { message: "Password must be at least 3 characters long." })
    .max(30, { message: "Username must not exceed 30 characters." }),
});

export type userLoginSchema = z.infer<typeof userLoginSchema>;

const updateData = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(15, { message: "Username must not exceed 15 characters." })
      .optional(),
    bio: z
      .string()
      .trim()
      .min(3, { message: "Bio must be at least 3 characters long." })
      .max(80, { message: "Bio must not exceed 80 characters." })
      .optional(),
  })
  .refine((data) => data.username || data.bio, {
    message: "At least one of 'username' or 'bio' must be provided.",
    path: ["username", "bio"],
  });

export type updateData = z.infer<typeof updateData>;

export { userSignupSchema, userLoginSchema, updateData };
