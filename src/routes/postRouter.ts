import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { createPostSchema, updatePostSchema } from "../validation/schemas";
import {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getRecentPosts,
  getLikedPosts,
  getPostById,
  getFollowingPosts,
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
  "/liked",
  passport.authenticate("jwt", { session: false }),
  getLikedPosts
);

postRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getRecentPosts
);

postRouter.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  getFollowingPosts
);

postRouter.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  getPosts
);

postRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getPostById
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
