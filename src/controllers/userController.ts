import { Request, Response } from "express";
import { fetchUsers, findUserById, fetchByUsername } from "../models/user";
import { updateUserService } from "../services/userServices";

async function getUsers(req: Request, res: Response) {
  try {
    const { id, username } = req.query;

    if (id) {
      const user = await findUserById({ id: parseInt(id as string) });
      res.status(200).json(user);
    } else if (username) {
      const user = await fetchByUsername({ username: username as string });
      res.status(200).json(user);
    } else {
      const users = await fetchUsers();
      res.status(200).json(users);
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
      error: "Internal server error during updating user",
    });
  }
}

export { getUsers, updateUser };
