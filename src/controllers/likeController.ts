import { Request, Response } from "express";
import { togglePostLike, toggleCommentLike } from "../models/like";

async function handlePostLike(req: Request, res: Response) {
  const postId = req.params.id;
  const user = req.user;
  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else if (!postId) {
      res.status(400).json({ error: "Post id not found." });
    } else {
      await togglePostLike({
        postId: parseInt(postId),
        userId: parseInt(user.id),
      });
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during like handling." });
  }
}

async function handleCommentLike(req: Request, res: Response) {
  const commentId = req.params.id;
  const user = req.user;
  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else if (!commentId) {
      res.status(400).json({ error: "Comment id not found." });
    } else {
      await toggleCommentLike({
        commentId: parseInt(commentId),
        userId: parseInt(user.id),
      });
      res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during like handling." });
  }
}

export { handlePostLike, handleCommentLike };
