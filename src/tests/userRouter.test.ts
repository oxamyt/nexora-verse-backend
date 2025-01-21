import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import userRouter from "../routes/userRouter";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanupDatabase } from "../utils/cleanupDatabase";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);

describe("Auth Router", async () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("should fetch users", async () => {
    const users = [
      {
        username: "john",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "harry",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "tyler",
        password: "password123",
        confirm: "password123",
      },
    ];
    for (const user of users) {
      await request(app)
        .post("/auth/signup")
        .send(user)
        .expect("Content-Type", /json/)
        .expect(201);
    }
    const fetchResponse = await request(app).get("/users").expect(200);

    const usersResponse = fetchResponse.body;

    for (const user of usersResponse) {
      expect(user).toMatchObject({ username: user.username });
    }
  });
});
