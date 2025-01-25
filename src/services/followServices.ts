import { findUserById } from "../models/user";
import { FollowData } from "../types/types";
import { toggleFollow } from "../models/follow";

async function toggleFollowService({ followerId, followedId }: FollowData) {
  if (!followedId) {
    return { statusCode: 400, error: "User id not found." };
  }

  if (followerId === followedId) {
    return { statusCode: 400, error: "Cannot follow yourself." };
  }

  const user = await findUserById({ id: followedId });
  if (!user) {
    return { statusCode: 404, error: "Target user not found" };
  }

  try {
    await toggleFollow({
      followerId,
      followedId,
    });
    return { statusCode: 204 };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { statusCode: 500, error: "Internal server error" };
  }
}

export { toggleFollowService };
