import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { userSignupSchema, userLoginSchema } from "../validation/schemas";
import { signup, login, githubLogin } from "../controllers/authController";
import passport from "passport";

const authRouter = Router();

authRouter.post("/signup", validateData(userSignupSchema), signup);

authRouter.post("/login", validateData(userLoginSchema), login);

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  githubLogin
);

export default authRouter;
