import { getPost } from "../models/post";
import { CreateCommentData } from "../types/types";
import { createNewComment } from "../models/comment";

async function createCommentService({
  userId,
  postId,
  content,
}: CreateCommentData) {
  try {
    const post = getPost({ id: postId });

    if (!post) {
      return { error: "No post found", statusCode: 400 };
    }

    const comment = await createNewComment({ userId, postId, content });
    return { comment, statusCode: 201 };
  } catch (error) {
    console.error();
    return {
      error: "Internal server error during comment creation.",
      statusCode: 500,
    };
  }
}

export { createCommentService };
