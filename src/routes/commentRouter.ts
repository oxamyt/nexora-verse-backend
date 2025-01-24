import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { CommentSchema } from "../validation/schemas";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import passport from "passport";

const commentRouter = Router();

commentRouter.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateData(CommentSchema),
  createComment
);

commentRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateData(CommentSchema),
  updateComment
);

commentRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

export default commentRouter;
