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

async function retrieveComment({ id }: { id: number }) {
  try {
    return await prisma.comment.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateCommentRecord({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  try {
    return await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteComment({ id }: { id: number }) {
  try {
    return await prisma.comment.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {
  createNewComment,
  retrieveComment,
  updateCommentRecord,
  deleteComment,
};
