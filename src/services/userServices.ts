import { UserUpdateData } from "../types/types";
import { fetchByUsername } from "../models/user";
import { updateUsername } from "../models/user";
import { updateProfileBio } from "../models/profile";

async function updateUserService({ username, bio, id }: UserUpdateData) {
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
      updatedProfile = await updateProfileBio({ bio, id });
    }

    return { updatedUser, updatedProfile, statusCode: 200 };
  } catch (error) {
    console.error("Error in updateUser service:", error);
    return { statusCode: 500 };
  }
}

export { updateUserService };
