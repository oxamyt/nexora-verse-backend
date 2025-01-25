import { PrismaClient } from "@prisma/client";
import { PostLikeData, CommentLikeData } from "../types/types";
import { getPost } from "./post";
import { retrieveComment } from "./comment";

const prisma = new PrismaClient();

async function togglePostLike({ postId, userId }: PostLikeData) {
  try {
    const post = await getPost({ id: postId });
    if (!post) {
      throw new Error("Post not found");
    }
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

async function toggleCommentLike({ commentId, userId }: CommentLikeData) {
  try {
    const comment = await retrieveComment({ id: commentId });
    if (!comment) {
      throw new Error("Comment not found");
    }
    const existingLike = await prisma.like.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingLike) {
      return await prisma.like.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
    } else {
      return await prisma.like.create({
        data: {
          commentId,
          userId,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { togglePostLike, toggleCommentLike };
