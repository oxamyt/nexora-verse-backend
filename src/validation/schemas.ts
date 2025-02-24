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

const updateUserDataSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(15, { message: "Username must not exceed 15 characters." })
      .optional(),
    bio: z.string().max(80).nullable().or(z.literal("")),
  })
  .refine((data) => data.username || data.bio !== undefined, {
    message: "At least one of 'username' or 'bio' must be provided.",
    path: ["username", "bio"],
  });

export type updateUserDataSchema = z.infer<typeof updateUserDataSchema>;

const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title must be at least 1 characters long." })
    .max(30, { message: "Title must not exceed 30 characters." }),
  body: z
    .string()
    .min(1, { message: "Body must be at least 1 characters long." })
    .max(300, { message: "Body must not exceed 300 characters." })
    .optional(),
});

export type createPostSchema = z.infer<typeof createPostSchema>;

const updatePostSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title must be at least 1 characters long." })
      .max(30, { message: "Title must not exceed 30 characters." })
      .optional(),
    body: z
      .string()
      .min(1, { message: "Body must be at least 1 characters long." })
      .max(300, { message: "Body must not exceed 80 characters." })
      .optional(),
  })
  .refine((data) => data.title || data.body, {
    message: "At least one of 'title' or 'body' must be provided.",
    path: ["title", "body"],
  });

export type updatePostSchema = z.infer<typeof createPostSchema>;

const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Body must be at least 1 characters long." })
    .max(200, { message: "Body must not exceed 200 characters." }),
});

export type CommentSchema = z.infer<typeof CommentSchema>;

const messageSchema = z.object({
  body: z
    .string()
    .min(1, "Message body is required")
    .max(500, "Message body must not exceed 500 characters."),
});

export type messageSchema = z.infer<typeof messageSchema>;

export {
  userSignupSchema,
  userLoginSchema,
  updateUserDataSchema,
  createPostSchema,
  updatePostSchema,
  CommentSchema,
  messageSchema,
};
