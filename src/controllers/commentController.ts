import { Request, Response } from "express";
import { createCommentService } from "../services/commentServices";

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

export { createComment };
