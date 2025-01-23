import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import userRouter from "../routes/userRouter";
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

describe("Post Router", async () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it("user should be able to create post", async () => {
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

    await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "How to cook a steak",
        body: "You need to fry it for 5 mins on every side!",
      })
      .expect(201);
  });

  it("user should be able to create post without body", async () => {
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

    await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Best article ever",
      })
      .expect(201);
  });

  it("user should be able to update post", async () => {
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

    const updateData = {
      title: "How to cook pasta",
      body: "You need to boil it for 10 mins!",
    };

    const updatePostResponse = await request(app)
      .patch(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData)
      .expect(200);

    expect(updatePostResponse.body.updatedPost.title).toBe(updateData.title);
    expect(updatePostResponse.body.updatedPost.body).toBe(updateData.body);
  });

  it("user should be able to delete post", async () => {
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

    await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("user should be able to fetch posts by user id", async () => {
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

    const { token, userId } = loginResponse.body;

    const posts = [
      {
        title: "How to cook a steak",
        body: "You need to fry it for 5 mins on every side!",
      },
      {
        title: "How to cook pasta",
        body: "You need to boil it for 10 mins!",
      },
      {
        title: "How to squat with barbell",
        body: "You need to squat slowly 5 times!",
      },
    ];

    for (const post of posts) {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(post)
        .expect("Content-Type", /json/)
        .expect(201);
    }

    const getPostsResponse = await request(app)
      .get(`/posts/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(getPostsResponse.body)).toBe(true);

    for (const post of posts) {
      expect(getPostsResponse.body).toEqual(
        expect.arrayContaining([expect.objectContaining(post)])
      );
    }
  });

  it("user should be able to fetch all recent posts", async () => {
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

    const { token } = loginResponse.body;

    const posts = [
      {
        title: "How to cook a steak",
        body: "You need to fry it for 5 mins on every side!",
      },
      {
        title: "How to cook pasta",
        body: "You need to boil it for 10 mins!",
      },
      {
        title: "How to squat with barbell",
        body: "You need to squat slowly 5 times!",
      },
    ];

    for (const post of posts) {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(post)
        .expect("Content-Type", /json/)
        .expect(201);
    }

    const getPostsResponse = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(getPostsResponse.body)).toBe(true);

    for (const post of posts) {
      expect(getPostsResponse.body).toEqual(
        expect.arrayContaining([expect.objectContaining(post)])
      );
    }
  });
});
