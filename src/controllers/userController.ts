import { Request, Response } from "express";
import { fetchUsers } from "../models/user";

async function getUsers(req: Request, res: Response) {
  try {
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error during fetching users." });
  }
}

export { getUsers };
