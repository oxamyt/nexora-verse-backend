import { Request, Response } from "express";
import {
  createNewPost,
  getUserPosts,
  retrieveRecentPosts,
  retrieveLikedPosts,
  fetchPostById,
  retrieveFollowingPosts,
} from "../models/post";
import {
  createPostService,
  updatePostService,
  deletePostService,
} from "../services/postServices";

async function createPost(req: Request, res: Response) {
  const { title, body } = req.body;
  const user = req.user;
  const file = req.file;

  try {
    if (user) {
      const newPost = await createPostService({
        file,
        title,
        body,
        userId: parseInt(user.id),
      });

      if (newPost.statusCode === 201) {
        res.status(newPost.statusCode).json(newPost.newPost);
      } else {
        res.status(newPost.statusCode).json({ error: newPost.error });
      }
    } else {
      res.status(401).json({ error: "No user data found." });
    }
  } catch (error) {
    console.error("Error during creating post:", error);
    res
      .status(500)
      .json({ error: "Internal server error during post creation." });
  }
}

async function getPosts(req: Request, res: Response) {
  const userId = req.params.userId;

  try {
    if (!userId) {
      res.status(400).json({ error: "No user id found." });
    } else {
      const posts = await getUserPosts({ userId: parseInt(userId) });
      res.status(200).json(posts);
    }
  } catch (error) {
    console.error("Error during fetching user`s post:", error);
    res.status(500).json({
      error: "Internal server error during getting posts by user id.",
    });
  }
}

async function getPostById(req: Request, res: Response) {
  const postId = req.params.id;

  try {
    if (!postId) {
      res.status(400).json({ error: "No post id found." });
    } else {
      const post = await fetchPostById({ id: parseInt(postId) });
      res.status(200).json(post);
    }
  } catch (error) {
    console.error("Error during fetching user`s post:", error);
    res.status(500).json({
      error: "Internal server error during getting posts by user id.",
    });
  }
}

async function getRecentPosts(req: Request, res: Response) {
  try {
    const posts = await retrieveRecentPosts();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error during fetching recent posts:", error);
    res.status(500).json({
      error: "Internal server error during getting recent posts.",
    });
  }
}

async function getLikedPosts(req: Request, res: Response) {
  const user = req.user;
  const { id } = req.params;

  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const posts = await retrieveLikedPosts({ userId: parseInt(id) });
      res.status(200).json(posts);
    }
  } catch (error) {
    console.error("Error during fetching liked posts:", error);
    res
      .status(500)
      .json({ error: "Internal sever error during getting liked posts." });
  }
}

async function updatePost(req: Request, res: Response) {
  const { title, body } = req.body;
  const postId = req.params.id;

  const user = req.user;
  const file = req.file;
  console.log(postId, "this is id");
  try {
    if (!user) {
      res.status(401).json({ error: "No user data found." });
    } else {
      const result = await updatePostService({
        file,
        postId: parseInt(postId),
        title,
        body,
        userId: parseInt(user.id),
      });

      if (result.statusCode === 200) {
        res.status(result.statusCode).json({ updatedPost: result.updatedPost });
      } else {
        res.status(result.statusCode).json({ error: result.error });
      }
    }
  } catch (error) {
    console.error("Error during updating post:", error);
    res
      .status(500)
      .json({ error: "Internal server error during post update." });
  }
}

async function deletePost(req: Request, res: Response) {
  const user = req.user;
  const postId = req.params.id;

  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const result = await deletePostService({
        userId: parseInt(user.id),
        postId: parseInt(postId),
      });

      res.status(result.statusCode).send();
    }
  } catch (error) {
    console.error("Error during deleting post:", error);
    res
      .status(500)
      .json({ error: "Internal server error while deleting the post." });
  }
}

async function getFollowingPosts(req: Request, res: Response) {
  const user = req.user;

  try {
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not authenticated." });
    } else {
      const followingPosts = await retrieveFollowingPosts({
        id: parseInt(user.id),
      });
      res.status(200).json(followingPosts);
    }
  } catch (error) {
    console.error("Error during fetching following posts:", error);
    res
      .status(500)
      .json({ error: "Internal sever error during getting following posts." });
  }
}

export {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getRecentPosts,
  getLikedPosts,
  getPostById,
  getFollowingPosts,
};
