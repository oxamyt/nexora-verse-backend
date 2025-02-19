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
import multer from "multer";

const userRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

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
