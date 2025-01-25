import { PrismaClient } from "@prisma/client";
import { FollowData } from "../types/types";

const prisma = new PrismaClient();

async function toggleFollow({ followerId, followedId }: FollowData) {
  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId,
          followedId,
        },
      },
    });

    if (existingFollow) {
      return await prisma.follow.delete({
        where: {
          followerId_followedId: {
            followerId,
            followedId,
          },
        },
      });
    } else {
      return await prisma.follow.create({
        data: {
          followerId,
          followedId,
        },
      });
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    throw new Error("Failed to toggle follow status");
  }
}

export { toggleFollow };
