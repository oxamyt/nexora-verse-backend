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

  it("user should be able to fetch followed users", async () => {
    const users = [
      {
        username: "john",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "peter",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "harry",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "kevin",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "michael",
        password: "password123",
        confirm: "password123",
      },
    ];

    const userIds = [];

    for (const user of users) {
      await request(app).post("/auth/signup").send(user);

      const userLoginResponse = await request(app)
        .post("/auth/login")
        .send({
          username: user.username,
          password: user.password,
        })
        .expect(200);

      userIds.push(userLoginResponse.body.userId);
    }

    await request(app).post("/auth/signup").send({
      username: "Mark",
      password: "password123",
      confirm: "password123",
    });

    const markLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "Mark",
        password: "password123",
      })
      .expect(200);

    const token = markLoginResponse.body.token;
    const markId = markLoginResponse.body.userId;

    for (const userId of userIds) {
      await request(app)
        .patch(`/follows/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
    }

    const followedUsersResponse = await request(app)
      .get(`/follows/followed/${markId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(followedUsersResponse.body)).toBe(true);
    expect(followedUsersResponse.body).toHaveLength(users.length);
    for (const user of users) {
      expect(followedUsersResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: user.username,
            avatarUrl: expect.any(String),
          }),
        ])
      );
    }
  });

  it("user should be able to fetch followers", async () => {
    const users = [
      {
        username: "john",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "peter",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "harry",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "kevin",
        password: "password123",
        confirm: "password123",
      },
      {
        username: "michael",
        password: "password123",
        confirm: "password123",
      },
    ];

    const userTokens = [];

    for (const user of users) {
      await request(app).post("/auth/signup").send(user);

      const userLoginResponse = await request(app)
        .post("/auth/login")
        .send({
          username: user.username,
          password: user.password,
        })
        .expect(200);

      userTokens.push(userLoginResponse.body.token);
    }

    await request(app).post("/auth/signup").send({
      username: "Mark",
      password: "password123",
      confirm: "password123",
    });

    const markLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "Mark",
        password: "password123",
      })
      .expect(200);

    const markToken = markLoginResponse.body.token;
    const markUserId = markLoginResponse.body.userId;

    for (const token of userTokens) {
      await request(app)
        .patch(`/follows/${markUserId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);
    }

    const followersResponse = await request(app)
      .get(`/follows/followers/${markUserId}`)
      .set("Authorization", `Bearer ${markToken}`)
      .expect(200);

    expect(Array.isArray(followersResponse.body)).toBe(true);
    expect(followersResponse.body).toHaveLength(users.length);

    for (const user of users) {
      expect(followersResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: user.username,
            avatarUrl: expect.any(String),
          }),
        ])
      );
    }
  });
});
