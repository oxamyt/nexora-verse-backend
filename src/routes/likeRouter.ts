import { Router } from "express";
import passport from "passport";
import { handlePostLike } from "../controllers/likeController";

const likeRouter = Router();

likeRouter.patch(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  handlePostLike
);

export default likeRouter;
