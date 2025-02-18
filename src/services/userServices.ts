import { UserUpdateData } from "../types/types";
import { fetchByUsername, findUserById } from "../models/user";
import { updateUsername } from "../models/user";
import { updateProfileBio } from "../models/profile";
import cloudinary from "../utils/cloudinary";

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

    updatedProfile = await updateProfileBio({ bio, id });

    return { updatedUser, updatedProfile, statusCode: 200 };
  } catch (error) {
    console.error("Error in updateUser service:", error);
    return { statusCode: 500 };
  }
}

async function UpdateAvatarService({ file, userId }) {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "avatars" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    if (!result) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const user = await findUserById({ id: userId });
  } catch (error) {
    console.error("Error in updateAvatar service:", error);
    return { statusCode: 500 };
  }
}

export { updateUserService };
