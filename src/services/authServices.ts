import bcrypt from "bcryptjs";
import { findUser, createUser } from "../models/user";
import { UserData } from "../types/types";
import signToken from "../utils/signToken";

async function userSignup({ username, password }: UserData) {
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
    return { success: false, error: "Internal server error during signup" };
  }
}

async function userLogin({ username, password }: UserData) {
  const user = await findUser({ username });

  if (!user) {
    return { success: false, error: "Invalid username or password" };
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = signToken({ userId: user.id });
    return { success: true, token, message: "Login successful" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error during login" };
  }
}

export { userSignup, userLogin };
