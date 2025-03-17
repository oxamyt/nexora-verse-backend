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

async function retrieveFollowed({ userId }: { userId: number }) {
  const follows = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return follows.map(
    (follow: {
      following: { id: number; username: string; avatarUrl: string };
    }) => follow.following
  );
}

async function retrieveFollowers({ userId }: { userId: number }) {
  const followers = await prisma.follow.findMany({
    where: {
      followedId: userId,
    },
    select: {
      follower: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return followers.map(
    (follow: {
      follower: { id: number; username: string; avatarUrl: string };
    }) => follow.follower
  );
}

export { toggleFollow, retrieveFollowed, retrieveFollowers };
