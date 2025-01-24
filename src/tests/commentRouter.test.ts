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

  it("user should be able to update comment for post", async () => {
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

    const commentId = commentResponse.body.id;

    const newData = { content: "I like this one!" };

    const updateCommentResponse = await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(newData)
      .expect(200);

    expect(updateCommentResponse.body).toMatchObject(newData);
  });

  it("second user should not be able to update first user comment for post", async () => {
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

    let token = firstLoginResponse.body.token;

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

    const commentId = commentResponse.body.id;

    const secondLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "peter",
        password: "password123",
      })
      .expect(200);

    token = secondLoginResponse.body.token;

    const newData = { content: "I like this one!" };

    await request(app)
      .patch(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(newData)
      .expect(403);
  });

  it("user should be able to delete comment for post", async () => {
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

    const commentId = commentResponse.body.id;

    await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("second user should be able to delete first user comment for post", async () => {
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

    let token = firstLoginResponse.body.token;

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

    const commentId = commentResponse.body.id;

    const secondLoginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "peter",
        password: "password123",
      })
      .expect(200);

    token = secondLoginResponse.body.token;

    await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });
});
