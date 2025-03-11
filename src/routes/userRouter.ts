import { Router } from "express";
import {
  getUsers,
  updateUser,
  updateAvatar,
  updateBanner,
} from "../controllers/userController";
import passport from "passport";
import { validateData } from "../middlewares/validationMiddleware";
import { updateUserDataSchema } from "../validation/schemas";
import upload from "../utils/multerSetup";

const userRouter = Router();

userRouter.get("/", passport.authenticate("jwt", { session: false }), getUsers);

userRouter.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateData(updateUserDataSchema),
  updateUser
);

userRouter.patch(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  updateAvatar
);

userRouter.patch(
  "/banner",
  passport.authenticate("jwt", { session: false }),
  upload.single("banner"),
  updateBanner
);

export default userRouter;
