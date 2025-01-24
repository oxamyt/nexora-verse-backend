import { Request, Response } from "express";
import {
  createCommentService,
  updateCommentService,
} from "../services/commentServices";

async function createComment(req: Request, res: Response) {
  const user = req.user;
  const postId = req.params.id;
  const { content } = req.body;

  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const result = await createCommentService({
        userId: parseInt(user.id),
        postId: parseInt(postId),
        content,
      });

      res
        .status(result.statusCode)
        .json(result.statusCode === 201 ? result.comment : result.error);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during comment creation." });
  }
}

async function updateComment(req: Request, res: Response) {
  const { content } = req.body;
  const commentId = req.params.id;
  const user = req.user;

  try {
    if (!user) {
      res.status(401).json({ error: "No user data found." });
    } else {
      const result = await updateCommentService({
        commentId: parseInt(commentId),
        userId: parseInt(user.id),
        content,
      });

      res
        .status(result.statusCode)
        .json(result.statusCode === 200 ? result.updatedComment : result.error);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error during post update." });
  }
}

export { createComment, updateComment };
