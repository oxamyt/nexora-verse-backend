import { Request, Response } from "express";
import { toggleFollowService } from "../services/followServices";

async function handleFollow(req: Request, res: Response) {
  try {
    const user = req.user;
    const followedUserId = req.params.id;

    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const result = await toggleFollowService({
        followerId: parseInt(user.id),
        followedId: parseInt(followedUserId),
      });

      if (result.statusCode === 204) {
        res.status(204).send();
      } else {
        res.status(result.statusCode).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error("Error in handleFollow:", error);
    res.status(500).json({ error: "Internal server error during following." });
  }
}

export { handleFollow };
