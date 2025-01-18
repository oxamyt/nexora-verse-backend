import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanupDatabase } from "../utils/cleanupDatabase";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth Router", async () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("should signup a user", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        username: "john",
        password: "password123",
        confirm: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.success).toBe(true);
  });

  it("should not signup a user when password do not match", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({
        username: "john",
        password: "password123",
        confirm: "password12345",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("should not signup a user when such username already exists", async () => {
    await request(app).post("/auth/signup").send({
      username: "john",
      password: "password123",
      confirm: "password123",
    });

    const response = await request(app)
      .post("/auth/signup")
      .send({
        username: "john",
        password: "password123",
        confirm: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Username already exists");
  });
});
