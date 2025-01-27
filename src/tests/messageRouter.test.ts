import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { AddressInfo } from "node:net";
import authRouter from "../routes/authRouter";
import messageRouter from "../routes/messageRouter";
import { cleanupDatabase } from "../utils/cleanupDatabase";
import passport from "../utils/passportConfig";

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/messages", messageRouter);

const httpServer = createServer(app);
const io = new Server(httpServer);

let serverAddress: AddressInfo;
let clientSocket: ClientSocket;

beforeAll(async () => {
  return new Promise<void>((resolve) => {
    httpServer.listen(() => {
      serverAddress = httpServer.address() as AddressInfo;
      clientSocket = ioc(`http://localhost:${serverAddress.port}`);
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

describe("Message Router", () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;

  async function createUser(username: string) {
    await request(app).post("/auth/signup").send({
      username,
      password: "password123",
      confirm: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username,
        password: "password123",
      })
      .expect(200);

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
});
