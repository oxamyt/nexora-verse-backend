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

    expect(response.body.error).toBe("Username already exists.");
  });

  it("should login a user and return a JWT token", async () => {
    await request(app).post("/auth/signup").send({
      username: "john",
      password: "password123",
      confirm: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password123",
      })
      .expect(200);

    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.token).toBeTypeOf("string");
  });

  it("should not login a user with wrong credentials", async () => {
    await request(app).post("/auth/signup").send({
      username: "john",
      password: "password123",
      confirm: "password123",
    });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password1234",
      })
      .expect(400);

    expect(loginResponse.body.token).not.toBeDefined();
  });

  it("should login a user into guest account", async () => {
    const guestLoginResponse = await request(app)
      .post("/auth/guest")
      .send()
      .expect(200);

    expect(guestLoginResponse.body.token).toBeDefined();
    expect(guestLoginResponse.body.token).toBeTypeOf("string");
  });
});
