import bcrypt from "bcryptjs";
import { findUser, createUser } from "../models/user";
import { createProfile } from "../models/profile";
import { UserData } from "../types/types";
import signToken from "../utils/signToken";
import { generateUniqueGuestUsername } from "../utils/generateGuestUsername";

async function signupService({ username, password }: UserData) {
  const user = await findUser({ username });

  if (user) {
    return {
      error: "Username already exists.",
      statusCode: 400,
    };
  }

  if (!password) {
    return {
      error: "No password",
      statusCode: 400,
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, password: hashedPassword });
    if (newUser) {
      await createProfile({ userId: newUser.id });
    }
    if (!newUser) {
      return {
        error: "Error creating a user.",
        statusCode: 400,
      };
    }

    return { statusCode: 201 };
  } catch (error) {
    console.error("Error in signup service:", error);
    return {
      error: "Internal server error during signup.",
      statusCode: 500,
    };
  }
}

async function githubLoginService(user: { id: string }) {
  try {
    const token = signToken({ userId: parseInt(user.id) });
    await createProfile({ userId: parseInt(user.id) });
    return {
      token,
      user,
      message: "Login successful.",
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error in githubLogin service:", error);
    return {
      error: "Internal server error during Github Authentication.",
      statusCode: 500,
    };
  }
}

async function loginService({ username, password }: UserData) {
  const user = await findUser({ username });

  if (!user) {
    return {
      error: "Invalid username or password.",
      statusCode: 400,
    };
  }

  if (!password) {
    return {
      error: "No password",
      statusCode: 400,
    };
  }

  try {
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          error: "Invalid username or password.",
          statusCode: 400,
        };
      }
    }
    const token = signToken({ userId: user.id });
    return {
      token,
      userId: user.id,
      message: "Login successful.",
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error in login service:", error);
    return {
      error: "Internal server error during login.",
      statusCode: 500,
    };
  }
}

async function guestLoginService() {
  try {
    const username = await generateUniqueGuestUsername();

    const newUser = await createUser({ username, isGuest: true });
    await createProfile({ userId: newUser.id });

    const token = signToken({ userId: newUser.id });

    return {
      token,
      userId: newUser.id,
      message: "Guest login successful.",
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error in guestLogin service:", error);
    return {
      error: "Internal server error during guest login service.",
      statusCode: 500,
    };
  }
}

export { signupService, loginService, githubLoginService, guestLoginService };
