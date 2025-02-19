import { UserUpdateData } from "../types/types";
import { fetchByUsername, findUserById } from "../models/user";
import { updateUsername } from "../models/user";
import { updateProfileBio, updateBanner } from "../models/profile";
import cloudinary from "../utils/cloudinary";
import { updateAvatar } from "../models/user";
import type { Express } from "express";

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

async function updateAvatarService({
  file,
  userId,
}: {
  file: Express.Multer.File;
  userId: number;
}) {
  try {
    const user = await findUserById({ id: userId });
    if (!user) {
      return { error: "User not found.", statusCode: 400 };
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nexora-avatars" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    if (!result) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const avatarUrl = (result as any).secure_url;

    await updateAvatar({ avatarUrl, userId: user.id });

    return { message: "Avatar successfully updated.", statusCode: 200 };
  } catch (error) {
    console.error("Error in updateAvatar service:", error);
    return { statusCode: 500 };
  }
}

async function updateBannerService({
  file,
  userId,
}: {
  file: Express.Multer.File;
  userId: number;
}) {
  try {
    const user = await findUserById({ id: userId });
    if (!user) {
      return { error: "User not found.", statusCode: 400 };
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "nexora-banners" }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });

    if (!result) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const bannerUrl = (result as any).secure_url;

    await updateBanner({ bannerUrl, userId: user.id });

    return { message: "Banner successfully updated.", statusCode: 200 };
  } catch (error) {
    console.error("Error in updateBanner service:", error);
    return { statusCode: 500 };
  }
}

export { updateUserService, updateAvatarService, updateBannerService };
