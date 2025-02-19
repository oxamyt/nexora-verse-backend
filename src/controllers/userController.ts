import { Request, Response } from "express";
import { fetchUsers, findUserById, fetchByUsername } from "../models/user";
import { updateUserService } from "../services/userServices";
import cloudinary from "../utils/cloudinary";
import { updateAvatarService } from "../services/userServices";

async function getUsers(req: Request, res: Response) {
  try {
    const { id, username } = req.query;
    const user = req.user;

    if (user) {
      if (id) {
        const retrievedUser = await findUserById({
          id: parseInt(id as string),
          requesterId: parseInt(user.id),
        });
        res.status(200).json(retrievedUser);
      } else if (username) {
        const user = await fetchByUsername({ username: username as string });
        res.status(200).json(user);
      } else {
        const users = await fetchUsers();
        res.status(200).json(users);
      }
    } else {
      res.status(400).json({ error: "No user detected." });
    }
  } catch (error) {
    console.error("Error during fetching users:", error);
    res
      .status(500)
      .json({ error: "Internal server error during fetching users." });
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const { username, bio } = req.body;
    const user = req.user;
    if (user) {
      const updatedUser = await updateUserService({
        username,
        bio,
        id: parseInt(user.id),
      });
      if (updatedUser) {
        res.status(updatedUser.statusCode).json(updatedUser);
      }
    } else {
      res.status(400).json({ error: "No user detected." });
    }
  } catch (error) {
    console.error("Error during updating user:", error);
    res.status(500).json({
      error: "Internal server error during updating user.",
    });
  }
}

async function updateAvatar(req: Request, res: Response) {
  try {
    const file = req.file;
    const user = req.user;

    if (!user) {
      res.status(400).json({ error: "No user detected." });
    } else {
      if (file && file.mimetype.startsWith("image/")) {
        const result = await updateAvatarService({
          file,
          userId: parseInt(user.id),
        });
        if (result.statusCode === 200) {
          res.status(result.statusCode).json({ message: result.message });
        } else {
          res.status(result.statusCode).json({ error: result.error });
        }
      }
    }
  } catch (error) {
    console.error("Error during updating user avatar:", error);
    res.status(500).json({
      error: " Internal server error during updating user avatar.",
    });
  }
}

export { getUsers, updateUser, updateAvatar };
