import bcrypt from "bcryptjs";
import { findUser, createUser } from "../models/user";
import { UserSignUpData } from "../types/types";

async function userSignup({ username, password }: UserSignUpData) {
  const user = await findUser({ username });

  if (user) {
    return { success: false, error: "Username already exists" };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, password: hashedPassword });

    if (!newUser) {
      return { success: false, error: "Error creating a user" };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "internal server error" };
  }
}

export { userSignup };
