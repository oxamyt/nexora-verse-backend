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
        return { success: false, error: "Such username already exists." };
      }

      updatedUser = await updateUsername({ username, id });
    }

    if (bio) {
      updatedProfile = await updateBio({ bio, id });
    }

    return { success: true, updatedUser, updatedProfile };
  } catch (error) {
    console.error(error);
  }
}

export { patchUser };
