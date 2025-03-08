import { Request, Response } from "express";
import { retrieveMessages } from "../models/message";
import {
  sendMessageService,
  updateMessageService,
  deleteMessageService,
} from "../services/messageServices";
import { Server } from "socket.io";

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

async function sendMessage(io: Server, req: Request, res: Response) {
  const { body } = req.body;
  const user = req.user;
  const receiverId = parseInt(req.params.id);

  if (isNaN(receiverId)) {
    res.status(400).json({ error: "Invalid receiver ID." });
  }
  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const senderId = parseInt(user.id);

      const result = await sendMessageService({ body, senderId, receiverId });

      if (result.statusCode === 201) {
        const roomName = [senderId, receiverId].sort().join("-");

        const newMessage = result.newMessage;
        io.to(roomName).emit("receiveMessage", newMessage);

        res.status(result.statusCode).json(newMessage);
      } else {
        res.status(result.statusCode).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error("Error during message sending:", error);
    res.status(500).json("Internal server error during sending message.");
  }
}

async function updateMessage(io: Server, req: Request, res: Response) {
  const { body, receiverId } = req.body;
  const user = req.user;
  const messageId = parseInt(req.params.id);

  if (isNaN(messageId)) {
    res.status(400).json({ error: "Invalid message ID." });
  }

  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const senderId = parseInt(user.id);

      const result = await updateMessageService({
        body,
        senderId,
        messageId,
      });

      if (result.statusCode === 200) {
        const roomName = [senderId, receiverId].sort().join("-");

        const updatedMessage = result.updatedMessage;

        io.to(roomName).emit("updateMessage", updatedMessage);

        res.status(result.statusCode).json(updatedMessage);
      } else {
        res.status(result.statusCode).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error("Error during message updating:", error);
    res.status(500).json("Internal server error during updating message.");
  }
}

async function deleteMessage(io: Server, req: Request, res: Response) {
  const user = req.user;
  const { receiverId } = req.body;
  const messageId = parseInt(req.params.id);

  if (isNaN(messageId)) {
    res.status(400).json({ error: "Invalid messageId ID." });
  } else if (isNaN(receiverId)) {
    res.status(400).json({ error: "Invalid receiver ID." });
  }
  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const senderId = parseInt(user.id);

      const result = await deleteMessageService({
        messageId,
        senderId,
      });

      if (result.statusCode === 204) {
        const roomName = [senderId, receiverId].sort().join("-");

        const newMessage = result.deletedMessage;
        io.to(roomName).emit("deleteMessage", newMessage);

        res.status(result.statusCode).json(newMessage);
      } else {
        res.status(result.statusCode).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error("Error during message deleting:", error);
    res.status(500).json("Internal server error during deleting message.");
  }
}

export { getMessages, sendMessage, updateMessage, deleteMessage };
