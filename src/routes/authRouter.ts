import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { userSignupSchema, userLoginSchema } from "../validation/schemas";
import { signup, login } from "../controllers/authController";
const authRouter = Router();

authRouter.post("/signup", validateData(userSignupSchema), signup);

authRouter.post("/login", validateData(userLoginSchema), login);

export default authRouter;
