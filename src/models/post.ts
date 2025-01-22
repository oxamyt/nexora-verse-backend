import { PrismaClient } from "@prisma/client";
import { CreatePostData, UpdatePostData } from "../types/types";

const prisma = new PrismaClient();

async function createNewPost({ title, body, id }: CreatePostData) {
  try {
    return await prisma.post.create({
      data: {
        title,
        body: body || null,
        userId: id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchPost({ id }: { id: number }) {
  try {
    return await prisma.post.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
}

async function updatePostRecord({ title, body, postId }: UpdatePostData) {
  try {
    const updateData: { title?: string; body?: string } = {};

    if (title) updateData.title = title;
    if (body !== undefined) updateData.body = body;

    return await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });
  } catch (error) {
    console.error(error);
  }
}

export { createNewPost, updatePostRecord, fetchPost };
