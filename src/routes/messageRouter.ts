import { Router } from "express";
import passport from "passport";
import { getMessages } from "../controllers/messageController";

const messageRouter = Router();

messageRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getMessages
);

export default messageRouter;
