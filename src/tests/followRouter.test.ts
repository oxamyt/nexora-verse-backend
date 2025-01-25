import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import userRouter from "../routes/userRouter";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import commentRouter from "../routes/commentRouter";
import { cleanupDatabase } from "../utils/cleanupDatabase";
import passport from "../utils/passportConfig";
import postRouter from "../routes/postRouter";
import followRouter from "../routes/followRouter";
import likeRouter from "../routes/likeRouter";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/follows", followRouter);
app.use("/likes", likeRouter);

describe("Follow Router", async () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("user should be able to follow user", async () => {
    await request(app).post("/auth/signup").send({
      username: "john",
      password: "password123",
      confirm: "password123",
    });

    await request(app).post("/auth/signup").send({
      username: "peter",
      password: "password123",
      confirm: "password123",
    });

    const firstLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password123",
      })
      .expect(200);

    const firstUserId = firstLoginResponse.body.userId;

    const secondLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "peter",
        password: "password123",
      })
      .expect(200);

    const token = secondLoginResponse.body.token;

    await request(app)
      .patch(`/follows/${firstUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("user should be able to follow and unfollow user", async () => {
    await request(app).post("/auth/signup").send({
      username: "john",
      password: "password123",
      confirm: "password123",
    });

    await request(app).post("/auth/signup").send({
      username: "peter",
      password: "password123",
      confirm: "password123",
    });

    const firstLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password123",
      })
      .expect(200);

    const firstUserId = firstLoginResponse.body.userId;

    const secondLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "peter",
        password: "password123",
      })
      .expect(200);

    const token = secondLoginResponse.body.token;

    await request(app)
      .patch(`/follows/${firstUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    await request(app)
      .patch(`/follows/${firstUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });
});
