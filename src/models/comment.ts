import { PrismaClient } from "@prisma/client";
import { CreateCommentData } from "../types/types";

const prisma = new PrismaClient();

async function createNewComment({
  userId,
  postId,
  content,
}: CreateCommentData) {
  try {
    return await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { createNewComment };
