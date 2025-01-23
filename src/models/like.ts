import { PrismaClient } from "@prisma/client";
import { PostLikeData } from "../types/types";

const prisma = new PrismaClient();

async function togglePostLike({ postId, userId }: PostLikeData) {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      return await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      return await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { togglePostLike };
