import bcrypt from "bcryptjs";
import { findUser, createUser } from "../models/user";
import { createProfile } from "../models/profile";
import { UserData } from "../types/types";
import signToken from "../utils/signToken";
import { objectInputType } from "zod";

async function userSignup({ username, password }: UserData) {
  const user = await findUser({ username });

  if (user) {
    return { success: false, error: "Username already exists." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, password: hashedPassword });
    if (newUser) {
      await createProfile({ id: newUser.id });
    }
    if (!newUser) {
      return { success: false, error: "Error creating a user." };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error during signup." };
  }
}

async function userGithubLogin(user: { id: string }) {
  try {
    const token = signToken({ userId: parseInt(user.id) });
    await createProfile({ id: parseInt(user.id) });
    return { success: true, token, user, message: "Login successful." };
  } catch (error) {
    console.error();
    return {
      success: false,
      error: "Internal server error during Github Authentication.",
    };
  }
}

async function userLogin({ username, password }: UserData) {
  const user = await findUser({ username });

  if (!user) {
    return { success: false, error: "Invalid username or password." };
  }

  try {
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { success: false, error: "Invalid username or password." };
      }
    }
    const token = signToken({ userId: user.id });
    return {
      success: true,
      token,
      userId: user.id,
      message: "Login successful.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Internal server error during login." };
  }
}

export { userSignup, userLogin, userGithubLogin };
