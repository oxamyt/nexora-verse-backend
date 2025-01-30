import { Router } from "express";
import passport from "passport";
import {
  getMessages,
  sendMessage,
  updateMessage,
} from "../controllers/messageController";
import { validateData } from "../middlewares/validationMiddleware";
import { messageSchema } from "../validation/schemas";
import { Server } from "socket.io";

export default function messageRouter(io: Server) {
  const messageRouter = Router();

  messageRouter.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    getMessages
  );

  messageRouter.post(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    validateData(messageSchema),
    (req, res) => sendMessage(io, req, res)
  );

  messageRouter.patch(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    validateData(messageSchema),
    (req, res) => updateMessage(io, req, res)
  );

  return messageRouter;
}
