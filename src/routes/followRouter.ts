import { Router } from "express";
import passport from "passport";
import {
  handleFollow,
  getFollowedUsers,
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
  getFollowedUsers
);

export default followRouter;
