import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { CommentSchema } from "../validation/schemas";
import { createComment, updateComment } from "../controllers/commentController";
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

export default commentRouter;
