import { userSignup, userLogin } from "../services/authServices";
import { Request, Response } from "express";

async function signup(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const signupResponse = await userSignup({ username, password });
    res.status(!signupResponse.success ? 400 : 201).json(signupResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during signup" });
  }
}

async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const loginResponse = await userLogin({ username, password });
    res.status(!loginResponse.success ? 400 : 200).json(loginResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during login" });
  }
}

export { signup, login };
