import { Router } from "express";
import { getUsers, updateUser } from "../controllers/userController";
import passport from "passport";
import { validateData } from "../middlewares/validationMiddleware";
import { updateUserDataSchema } from "../validation/schemas";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateData(updateUserDataSchema),
  updateUser
);

export default userRouter;
