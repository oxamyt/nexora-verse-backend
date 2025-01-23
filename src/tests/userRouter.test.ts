import request from "supertest";
import express from "express";
import authRouter from "../routes/authRouter";
import userRouter from "../routes/userRouter";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanupDatabase } from "../utils/cleanupDatabase";
import passport from "../utils/passportConfig";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
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

  it("should fetch user by id and username using queries", async () => {
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
    ];
    for (const user of users) {
      await request(app)
        .post("/auth/signup")
        .send(user)
        .expect("Content-Type", /json/)
        .expect(201);
    }

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password123",
      })
      .expect(200);

    const userId = loginResponse.body.userId;

    const fetchIdResponse = await request(app)
      .get(`/users?id=${userId}`)
      .expect(200);

    const fetchUsernameResponse = await request(app).get(
      "/users?username=harry"
    );

    expect(fetchIdResponse.body).toMatchObject({ username: "john" });
    expect(fetchUsernameResponse.body).toMatchObject({ username: "harry" });
  });

  it("user should be able to update user/profile", async () => {
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

    const updateData = { username: "peter", bio: "I'm just a peter." };

    const updateUserResponse = await request(app)
      .patch("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(updateData)
      .expect(200);

    expect(updateUserResponse.body.updatedUser.username).toBe(
      updateData.username
    );
    expect(updateUserResponse.body.updatedProfile.bio).toBe(updateData.bio);
  });

  it("user should not be able to update user/profile to existing username", async () => {
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

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        username: "john",
        password: "password123",
      })
      .expect(200);

    const token = loginResponse.body.token;

    await request(app)
      .patch("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "peter", bio: "I'm just a peter." })
      .expect(400);
  });
});
