import { Request, Response } from "express";
import { toggleFollowService } from "../services/followServices";
import { retrieveFollowed, retrieveFollowers } from "../models/follow";

async function handleFollow(req: Request, res: Response) {
  const user = req.user;
  const followedUserId = req.params.id;
  try {
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
    console.error(error);
    res.status(500).json({ error: "Internal server error during following." });
  }
}

async function getFollowed(req: Request, res: Response) {
  const userId = parseInt(req.params.id);
  try {
    if (!userId) {
      res.status(401).json({ error: "No user id found." });
    } else {
      const followedUsers = await retrieveFollowed({ userId });
      res.status(200).json(followedUsers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error during following." });
  }
}

async function getFollowers(req: Request, res: Response) {
  const userId = parseInt(req.params.id);
  try {
    if (!userId) {
      res.status(401).json({ error: "No user id found." });
    } else {
      const followers = await retrieveFollowers({ userId });
      res.status(200).json(followers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error during following." });
  }
}

export { handleFollow, getFollowed, getFollowers };
