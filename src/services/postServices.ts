import { EditPostParams } from "../types/types";
import { getPost, updatePost, deletePost } from "../models/post";

async function updatePostService({
  postId,
  title,
  body,
  userId,
}: EditPostParams) {
  try {
    const post = await getPost({ id: postId });

    if (!post) {
      return { error: "Post not found.", statusCode: 400 };
    }

    if (post.userId !== userId) {
      return {
        error: "Unauthorized to update this post.",
        statusCode: 403,
      };
    }

    const updatedPost = await updatePost({ title, body, postId });
    return { updatedPost, statusCode: 200 };
  } catch (error) {
    console.error("Error in updatePost service:", error);
    return {
      error: "Internal server error during post update.",
      statusCode: 500,
    };
  }
}

async function deletePostService({
  userId,
  postId,
}: {
  userId: number;
  postId: number;
}) {
  try {
    const post = await getPost({ id: postId });

    if (!post) {
      return { error: "Post not found.", statusCode: 400 };
    }

    if (post.userId !== userId) {
      return {
        error: "Unauthorized to delete this post.",
        statusCode: 403,
      };
    }

    await deletePost({ id: postId });
    return { statusCode: 204 };
  } catch (error) {
    console.error("Error in deletePost service:", error);
    return {
      error: "Internal server error while deleting post",
      statusCode: 500,
    };
  }
}

export { updatePostService, deletePostService };
