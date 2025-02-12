import {
  MessageData,
  UpdateMessageData,
  DeleteMessageData,
} from "../types/types";
import { findUserById } from "../models/user";
import {
  createMessage,
  findMessage,
  updateMessage,
  deleteMessage,
} from "../models/message";

async function sendMessageService({ body, senderId, receiverId }: MessageData) {
  try {
    const sender = await findUserById({ id: senderId });
    const receiver = await findUserById({ id: receiverId });

    if (!sender || !receiver) {
      return { statusCode: 400, error: "Sender or receiver not found." };
    }

    const newMessage = await createMessage({ body, senderId, receiverId });

    return { statusCode: 201, newMessage };
  } catch (error) {
    console.error("Error during sendMessageService:", error);
    return {
      error: "Internal server error sending message.",
      statusCode: 500,
    };
  }
}

async function updateMessageService({
  body,
  senderId,
  messageId,
}: UpdateMessageData) {
  try {
    const message = await findMessage({ id: messageId });

    if (!message) {
      return { statusCode: 400, error: "Message not found" };
    }

    if (message.senderId !== senderId) {
      return {
        statusCode: 403,
        error: "You don't have access to update this message.",
      };
    }

    const updatedMessage = await updateMessage({ body, id: messageId });
    return { statusCode: 200, updatedMessage };
  } catch (error) {
    console.error("Error during updateMessageService:", error);
    return {
      error: "Internal server error updating message.",
      statusCode: 500,
    };
  }
}

async function deleteMessageService({
  senderId,
  messageId,
}: DeleteMessageData) {
  try {
    const message = await findMessage({ id: messageId });

    if (!message) {
      return { statusCode: 400, error: "Message not found" };
    }

    if (message.senderId !== senderId) {
      return {
        statusCode: 403,
        error: "You don't have access to delete this message.",
      };
    }

    const deletedMessage = await deleteMessage({ id: messageId });
    return { statusCode: 204, deletedMessage };
  } catch (error) {
    console.error("Error during deleteMessageService:", error);
    return {
      error: "Internal server error deleting message.",
      statusCode: 500,
    };
  }
}

export { sendMessageService, updateMessageService, deleteMessageService };
