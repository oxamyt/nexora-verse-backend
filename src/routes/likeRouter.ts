import { Router } from "express";
import passport from "passport";
import {
  handlePostLike,
  handleCommentLike,
} from "../controllers/likeController";

const likeRouter = Router();

likeRouter.patch(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostLike
);

likeRouter.patch(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  handleCommentLike
);

export default likeRouter;
