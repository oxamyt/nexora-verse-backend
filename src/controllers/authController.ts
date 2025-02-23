import {
  signupService,
  loginService,
  githubLoginService,
} from "../services/authServices";
import { Request, Response } from "express";

async function signup(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const signupResponse = await signupService({ username, password });
    res.status(signupResponse.statusCode).json(signupResponse);
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "Internal server error during signup." });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const loginResponse = await loginService({ username, password });
    res.status(loginResponse.statusCode).json(loginResponse);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error during login." });
  }
}

async function githubLogin(req: Request, res: Response) {
  const user = req.user;

  try {
    if (user) {
      const githubAuthResponse = await githubLoginService(user);

      if (githubAuthResponse.statusCode === 200) {
        res.redirect(
          `${process.env.FRONTEND_URL}#token=${githubAuthResponse.token}&userId=${user.id}`
        );
      } else {
        res.status(githubAuthResponse.statusCode).json(githubAuthResponse);
      }
    } else {
      res.status(400).json({ error: "No user detected." });
    }
  } catch (error) {
    console.error("Error during github login:", error);
    res
      .status(500)
      .json({ error: "Internal server error during github login." });
  }
}

export { signup, login, githubLogin };
