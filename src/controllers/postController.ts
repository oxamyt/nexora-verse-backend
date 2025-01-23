import { Request, Response } from "express";
import { createNewPost, updatePostRecord } from "../models/post";
import { editPost } from "../services/postServices";

async function createPost(req: Request, res: Response) {
  const { title, body } = req.body;
  const user = req.user;

  try {
    if (user) {
      const newPost = await createNewPost({
        title,
        body,
        id: parseInt(user.id),
      });
      res.status(201).json({ newPost });
    } else {
      res.status(400).json({ error: "No user data found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during post creation." });
  }
}

async function updatePost(req: Request, res: Response) {
  const { title, body } = req.body;
  const postId = req.params.id;
  const user = req.user;

  try {
    if (!user) {
      return res.status(400).json({ error: "No user data found." });
    }

    const result = await editPost({
      postId: parseInt(postId),
      title,
      body,
      userId: parseInt(user.id),
    });

    if (result.statusCode === 200) {
      res.status(result.statusCode).json({ updatedPost: result.updatedPost });
    } else {
      res.status(result.statusCode).json({ error: result.error });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during post update." });
  }
}

export { createPost, updatePost };
