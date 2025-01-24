import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { createCommentSchema } from "../validation/schemas";
import { createComment } from "../controllers/commentController";
import passport from "passport";

const commentRouter = Router();

commentRouter.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateData(createCommentSchema),
  createComment
);

export default commentRouter;
