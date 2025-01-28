import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { createServer } from "node:http";
import { Server, type Socket as ServerSocket } from "socket.io";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "node:net";
import authRouter from "../routes/authRouter";
import messageRouter from "../routes/messageRouter";
import passport from "../utils/passportConfig";
import { cleanupDatabase } from "../utils/cleanupDatabase";
import { setupSocketHandlers } from "../socketHandlers/socketHandlers";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("Message Router", () => {
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(passport.initialize());
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use("/messages", messageRouter);

    return new Promise<void>((resolve) => {
      const httpServer = createServer(app);
      io = new Server(httpServer);
      setupSocketHandlers(io);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", () => {
          resolve();
        });
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  async function createUser(username: string) {
    await request(app).post("/auth/signup").send({
      username,
      password: "password123",
      confirm: "password123",
    });

    const loginResponse = await request(app).post("/auth/login").send({
      username,
      password: "password123",
    });

    return loginResponse.body;
  }

  it("should fetch chat history between two users", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user1Token = user1.token;
    const user2Id = user2.userId;

    const response = await request(app)
      .get(`/messages/${user2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it("user should send and retrieve message", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user2Id = user2.userId;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    await waitFor(clientSocket, "joinChat");

    const messageData = {
      senderId: user1.userId,
      receiverId: user2Id,
      body: "Hello!",
    };

    clientSocket.emit("sendMessage", messageData);
    const receivedMessage = await waitFor(clientSocket, "receiveMessage");

    expect(receivedMessage).toEqual(expect.objectContaining(messageData));
  });

  it("should reject empty message", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user2Id = user2.userId;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    await waitFor(clientSocket, "joinChat");

    const messageData = {
      senderId: user1.userId,
      receiverId: user2Id,
      body: "",
    };

    const response = await new Promise((resolve) => {
      clientSocket.emit("sendMessage", messageData, (response: any) => {
        resolve(response);
      });
    });

    expect(response).toEqual({
      status: "error",
      message: "Message body is required",
    });
  });
});
