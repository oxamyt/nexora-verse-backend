import { Server, Socket } from "socket.io";
import { sendMessage } from "../models/message";
import { messageSchema } from "../validation/schemas";
import { findUserById } from "../models/user";
import { ZodError } from "zod";

async function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("a user connected:", socket.id);

    socket.on("joinChat", ({ userId, chatPartnerId }) => {
      const roomName = [userId, chatPartnerId].sort().join("-");
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
      socket.emit("joinChat", { roomName });
    });

    socket.on("sendMessage", async (message, callback) => {
      try {
        const validatedMessage = messageSchema.parse(message);

        const senderId = validatedMessage.senderId;
        const receiverId = validatedMessage.receiverId;

        const sender = await findUserById({ id: senderId });
        const receiver = await findUserById({ id: receiverId });

        if (!sender || !receiver) {
          callback({ status: "error", message: "Invalid sender or receiver" });
          throw new Error("Invalid sender or receiver");
        }

        const newMessage = await sendMessage(validatedMessage);

        const roomName = [newMessage.senderId, newMessage.receiverId]
          .sort()
          .join("-");

        io.to(roomName).emit("receiveMessage", newMessage);
        if (typeof callback === "function")
          callback({ status: "success", message: "Message sent" });
      } catch (error) {
        console.error("Error saving message:", error);

        if (error instanceof ZodError) {
          const errorMessage = error.errors[0].message;
          callback({
            status: "error",
            message: errorMessage,
          });
        } else {
          callback({
            status: "error",
            message: "Failed to send message",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
}

export { setupSocketHandlers };
