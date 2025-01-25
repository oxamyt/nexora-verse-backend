import { Router } from "express";
import passport from "passport";
import { handleFollow } from "../controllers/followController";

const followRouter = Router();

followRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  handleFollow
);

export default followRouter;
