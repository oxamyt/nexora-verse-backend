import { userSignup } from "../services/authServices";
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

export { signup };
