import { Router } from "express";
import passport from "passport";
import {
  handleFollow,
  getFollowed,
  getFollowers,
} from "../controllers/followController";

const followRouter = Router();

followRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  handleFollow
);

followRouter.get(
  "/followed/:id",
  passport.authenticate("jwt", { session: false }),
  getFollowed
);

followRouter.get(
  "/followers/:id",
  passport.authenticate("jwt", { session: false }),
  getFollowers
);

export default followRouter;
