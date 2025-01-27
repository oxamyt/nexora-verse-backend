import { Request, Response } from "express";
import { retrieveMessages } from "../models/message";

async function getMessages(req: Request, res: Response) {
  const user = req.user;
  const targetId = parseInt(req.params.id);
  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const messages = await retrieveMessages({
        userId: parseInt(user.id),
        targetId,
      });
      res.status(200).json(messages);
    }
  } catch (error) {
    console.error("Error during fetching messages", error);
    res
      .status(500)
      .json({ error: "Internal server error during fetching messages" });
  }
}

export { getMessages };
