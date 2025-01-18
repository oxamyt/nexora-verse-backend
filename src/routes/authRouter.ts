import { Router } from "express";
import { validateData } from "../middlewares/validationMiddleware";
import { userSignupSchema } from "../validation/schemas";
import { signup } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", validateData(userSignupSchema), signup);

export default authRouter;
