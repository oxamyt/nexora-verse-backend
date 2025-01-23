import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { createPostSchema, updatePostSchema } from "../validation/schemas";
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getRecentPosts,
} from "../controllers/postController";
import passport from "passport";

const postRouter = Router();

postRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateData(createPostSchema),
  createPost
);

postRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getPosts
);

postRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getRecentPosts
);

postRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateData(updatePostSchema),
  updatePost
);

postRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);

export default postRouter;
