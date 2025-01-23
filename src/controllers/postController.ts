import { Request, Response } from "express";
import { createNewPost } from "../models/post";
import { updatePostService, deletePostService } from "../services/postServices";

async function createPost(req: Request, res: Response) {
  const { title, body } = req.body;
  const user = req.user;

  try {
    if (user) {
      const newPost = await createNewPost({
        title,
        body,
        userId: parseInt(user.id),
      });
      res.status(201).json({ newPost });
    } else {
      res.status(401).json({ error: "No user data found." });
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
      res.status(401).json({ error: "No user data found." });
    } else {
      const result = await updatePostService({
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
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during post update." });
  }
}

async function deletePost(req: Request, res: Response) {
  const user = req.user;
  const postId = req.params.id;

  try {
    if (!user) {
      res.status(401).json({ error: "No user data found." });
    } else {
      const result = await deletePostService({
        userId: parseInt(user.id),
        postId: parseInt(postId),
      });

      res.status(result.statusCode).send();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error while deleting the post." });
  }
}

export { createPost, updatePost, deletePost };
