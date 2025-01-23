import { UserUpdateData } from "../types/types";
import { fetchByUsername } from "../models/user";
import { updateUsername } from "../models/user";
import { updateBio } from "../models/profile";

async function patchUser({ username, bio, id }: UserUpdateData) {
  try {
    let updatedUser = null;
    let updatedProfile = null;

    if (username) {
      const existingUser = await fetchByUsername({ username });

      if (existingUser) {
        return {
          error: "Such username already exists.",
          statusCode: 400,
        };
      }

      updatedUser = await updateUsername({ username, id });
    }

    if (bio) {
      updatedProfile = await updateBio({ bio, id });
    }

    return { updatedUser, updatedProfile, statusCode: 200 };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}

export { patchUser };
