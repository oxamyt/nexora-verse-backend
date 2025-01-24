import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import userRouter from "../routes/userRouter";
import likeRouter from "../routes/likeRouter";
import commentRouter from "../routes/commentRouter";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanupDatabase } from "../utils/cleanupDatabase";
import passport from "../utils/passportConfig";
import postRouter from "../routes/postRouter";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);

describe("Comment Router", async () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("user should be able to create comment for post", async () => {
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

    const token = loginResponse.body.token;

    const postResponse = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "How to cook a steak",
        body: "You need to fry it for 5 mins on every side!",
      })
      .expect(201);

    const postId = postResponse.body.newPost.id;

    const data = { content: "Great tutorial!" };

    const commentResponse = await request(app)
      .post(`/comments/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(data)
      .expect(201);

    expect(commentResponse.body).toMatchObject(data);
  });
});
