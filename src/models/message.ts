import { PrismaClient } from "@prisma/client";
import {
  RetrieveMessagesData,
  MessageData,
  UpdateMessageModel,
} from "../types/types";

const prisma = new PrismaClient();

async function retrieveMessages({ userId, targetId }: RetrieveMessagesData) {
  try {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    throw error;
  }
}

async function createMessage({ body, senderId, receiverId }: MessageData) {
  try {
    return await prisma.message.create({
      data: {
        body,
        senderId,
        receiverId,
      },
    });
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

async function findMessage({ id }: { id: number }) {
  try {
    return await prisma.message.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
}

async function updateMessage({ id, body }: UpdateMessageModel) {
  try {
    return await prisma.message.update({
      where: { id },
      data: {
        id,
        body,
      },
    });
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
}

async function deleteMessage({ id }: { id: number }) {
  try {
    return await prisma.message.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

export {
  retrieveMessages,
  createMessage,
  findMessage,
  updateMessage,
  deleteMessage,
};
