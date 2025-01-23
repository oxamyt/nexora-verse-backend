import { EditPostParams } from "../types/types";
import { fetchPost, updatePostRecord } from "../models/post";

async function editPost({ postId, title, body, userId }: EditPostParams) {
  try {
    const post = await fetchPost({ id: postId });

    if (!post) {
      return { error: "Post not found.", statusCode: 400 };
    }

    if (post.userId !== userId) {
      return {
        error: "Unauthorized to update this post.",
        statusCode: 403,
      };
    }

    const updatedPost = await updatePostRecord({ title, body, postId });
    return { updatedPost, statusCode: 200 };
  } catch (error) {
    console.error(error);
    return {
      error: "Internal server error during post update.",
      statusCode: 500,
    };
  }
}

export { editPost };
