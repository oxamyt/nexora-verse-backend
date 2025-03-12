import { EditPostParams } from "../types/types";
import { createNewPost, getPost, updatePost, deletePost } from "../models/post";
import { CreatePostData } from "../types/types";
import cloudinary from "../utils/cloudinary";

async function createPostService({
  file,
  title,
  body,
  userId,
}: CreatePostData) {
  try {
    let imageUrl;
    if (file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "nexora-post-images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });

      if (!result) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      imageUrl = (result as any).secure_url;
    }
    const newPost = await createNewPost({
      title,
      body,
      userId,
      imageUrl,
    });

    return { newPost, statusCode: 201 };
  } catch (error) {
    console.error("Error in createPost service:", error);
    return { statusCode: 500, error: "Error during creating post." };
  }
}

async function updatePostService({
  postId,
  title,
  body,
  userId,
  file,
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

    let imageUrl;
    if (file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "nexora-post-images" }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      });

      if (!result) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      imageUrl = (result as any).secure_url;
    }

    const updatedPost = await updatePost({ title, body, postId, imageUrl });
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

export { createPostService, updatePostService, deletePostService };
