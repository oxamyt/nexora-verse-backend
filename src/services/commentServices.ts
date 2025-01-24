import { getPost } from "../models/post";
import { CreateCommentData, updateCommentData } from "../types/types";
import {
  createNewComment,
  retrieveComment,
  updateCommentRecord,
} from "../models/comment";

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

async function updateCommentService({
  content,
  commentId,
  userId,
}: updateCommentData) {
  try {
    const comment = await retrieveComment({ id: commentId });

    if (!comment) {
      return { error: "Comment not found.", statusCode: 400 };
    }

    if (comment.userId !== userId) {
      return {
        error: "Unauthorized to update this comment.",
        statusCode: 403,
      };
    }

    const updatedComment = await updateCommentRecord({
      id: commentId,
      content,
    });
    return { updatedComment, statusCode: 200 };
  } catch (error) {
    console.error(error);
    return {
      error: "Internal server error during post update.",
      statusCode: 500,
    };
  }
}

export { createCommentService, updateCommentService };
