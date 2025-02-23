import { PrismaClient } from "@prisma/client";
import { CreatePostData, UpdatePostData } from "../types/types";

const prisma = new PrismaClient();

async function createNewPost({ title, body, userId }: CreatePostData) {
  try {
    return await prisma.post.create({
      data: {
        title,
        body: body || null,
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getPost({ id }: { id: number }) {
  try {
    return await prisma.post.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUserPosts({ userId }: { userId: number }) {
  try {
    return await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function retrieveRecentPosts() {
  try {
    return await prisma.post.findMany({
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function retrieveLikedPosts({ userId }: { userId: number }) {
  try {
    return await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updatePost({ title, body, postId }: UpdatePostData) {
  try {
    const postUpdateData: { title?: string; body?: string } = {};

    if (title) postUpdateData.title = title;
    if (body !== undefined) postUpdateData.body = body;

    return await prisma.post.update({
      where: { id: postId },
      data: postUpdateData,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deletePost({ id }: { id: number }) {
  try {
    return await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchPostById({ id }: { id: number }) {
  try {
    return await prisma.post.findUnique({
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
  createNewPost,
  updatePost,
  getPost,
  getUserPosts,
  retrieveRecentPosts,
  retrieveLikedPosts,
  deletePost,
  fetchPostById,
};
