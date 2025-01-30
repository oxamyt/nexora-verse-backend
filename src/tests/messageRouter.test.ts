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

  app = express();
  const httpServer = createServer(app);
  io = new Server(httpServer);
  app.use(passport.initialize());
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/messages", messageRouter(io));
  setupSocketHandlers(io);
  beforeAll(() => {
    return new Promise<void>((resolve) => {
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
    const user1Token = user1.token;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    const messageData = {
      body: "Hello!",
    };

    const socketEventReceived = new Promise<void>((resolve) => {
      clientSocket.on("receiveMessage", (arg) => {
        expect(arg).toEqual(expect.objectContaining(messageData));
        resolve();
      });
    });

    await request(app)
      .post(`/messages/${user2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send(messageData)
      .expect(201);

    await socketEventReceived;
  });

  it("should reject empty message", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user2Id = user2.userId;
    const user1Token = user1.token;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    const messageData = {
      body: "",
    };

    await request(app)
      .post(`/messages/${user2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send(messageData)
      .expect(400);
  });

  it("user should update and retrieve message", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user2Id = user2.userId;
    const user1Token = user1.token;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    const messageData = {
      body: "Hello!",
    };

    const response = await request(app)
      .post(`/messages/${user2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send(messageData)
      .expect(201);

    const messageId = response.body.id;

    const newMessageData = {
      body: "Hello there!",
      receiverId: user2Id,
    };

    const socketMessageUpdate = new Promise<void>((resolve) => {
      clientSocket.on("updateMessage", (arg) => {
        expect(arg).toEqual(expect.objectContaining(newMessageData));
        resolve();
      });
    });

    await request(app)
      .patch(`/messages/${messageId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send(newMessageData)
      .expect(200);

    await socketMessageUpdate;
  });

  it("user should delete message", async () => {
    const user1 = await createUser("john");
    const user2 = await createUser("peter");

    const user2Id = user2.userId;
    const user1Token = user1.token;

    clientSocket.emit("joinChat", {
      userId: user1.userId,
      chatPartnerId: user2Id,
    });

    const messageData = {
      body: "Hello!",
    };

    const socketMessageDelete = new Promise<void>((resolve) => {
      clientSocket.on("deleteMessage", (arg) => {
        expect(arg).toEqual(expect.objectContaining(messageData));
        resolve();
      });
    });

    const response = await request(app)
      .post(`/messages/${user2Id}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send(messageData)
      .expect(201);

    const messageId = response.body.id;

    await request(app)
      .delete(`/messages/${messageId}`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ receiverId: user2Id })
      .expect(204);

    await socketMessageDelete;
  });
});
