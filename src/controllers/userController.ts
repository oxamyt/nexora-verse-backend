import { Request, Response } from "express";
import { fetchUsers, fetchById, fetchByUsername } from "../models/user";

async function getUsers(req: Request, res: Response) {
  try {
    const { id, username } = req.query;

    if (id) {
      const user = await fetchById({ id: parseInt(id as string) });
      res.status(200).json(user);
    } else if (username) {
      const user = await fetchByUsername({ username: username as string });
      res.status(200).json(user);
    } else {
      const users = await fetchUsers();
      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error during fetching users." });
  }
}

export { getUsers };
