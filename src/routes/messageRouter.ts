import { Router } from "express";
import passport from "passport";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/messageController";
import { validateData } from "../middlewares/validationMiddleware";
import { messageSchema } from "../validation/schemas";
import { Server } from "socket.io";

export default function messageRouter(io: Server) {
  const messageRouter = Router();
  const auth = passport.authenticate("jwt", { session: false });

  messageRouter
    .get("/:id", auth, getMessages)
    .post("/:id", auth, validateData(messageSchema), (req, res) =>
      sendMessage(io, req, res)
    )
    .patch("/:id", auth, validateData(messageSchema), (req, res) =>
      updateMessage(io, req, res)
    )
    .delete("/:id", auth, (req, res) => deleteMessage(io, req, res));

  return messageRouter;
}
