import { userSignup, userLogin } from "../services/authServices";
import { Request, Response } from "express";
import signToken from "../utils/signToken";

async function signup(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const signupResponse = await userSignup({ username, password });
    res.status(!signupResponse.success ? 400 : 201).json(signupResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during signup." });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const loginResponse = await userLogin({ username, password });
    res.status(!loginResponse.success ? 400 : 200).json(loginResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during login." });
  }
}

async function githubLogin(req: Request, res: Response) {
  const user = req.user;

  try {
    if (user) {
      const token = signToken({ userId: parseInt(user.id) });
      res
        .status(200)
        .json({ success: true, token, user, message: "Login successful." });
    } else {
      res.status(400).json({ success: false, error: "No user detected." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error during github login." });
  }
}

export { signup, login, githubLogin };
