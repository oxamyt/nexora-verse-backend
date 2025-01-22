import { Request, Response } from "express";
import { createNewPost, updatePostRecord } from "../models/post";
import { fetchPost } from "../models/post";

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
      res.status(201).json({ newPost, success: true });
    } else {
      res.status(400).json({ message: "No user data found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error during post creation." });
  }
}

async function updatePost(req: Request, res: Response) {
  const { title, body } = req.body;
  const postId = req.params.id;
  const user = req.user;

  try {
    if (user) {
      const post = await fetchPost({ id: parseInt(postId) });

      if (!post) {
        res.status(400).json({ success: false, error: "Post not found." });
      } else {
        if (post.userId === parseInt(user.id)) {
          const updatedPost = await updatePostRecord({
            title,
            body,
            postId: parseInt(postId),
          });
          res.status(200).json({ updatedPost, success: true });
        } else {
          res
            .status(403)
            .json({
              success: false,
              error: "Unauthorized to update this post.",
            });
        }
      }
    } else {
      res.status(400).json({ message: "No user data found." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error during post update." });
  }
}

export { createPost, updatePost };
