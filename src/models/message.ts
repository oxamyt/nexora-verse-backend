import { PrismaClient } from "@prisma/client";
import { RetrieveMessagesData } from "../types/types";

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

export { retrieveMessages };
