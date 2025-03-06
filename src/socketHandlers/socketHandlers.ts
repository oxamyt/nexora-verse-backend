import { Server, Socket } from "socket.io";

async function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("a user connected:", socket.id);

    socket.on("joinChat", ({ userId, chatPartnerId }) => {
      const roomName = [userId, chatPartnerId].sort().join("-");
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
      socket.emit("joinChat", { roomName });
    });

    socket.on("leaveChat", ({ userId, chatPartnerId }) => {
      const roomName = [userId, chatPartnerId].sort().join("-");
      socket.leave(roomName);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
}

export { setupSocketHandlers };
