interface UserData {
  username: string;
  password: string;
}

interface UserUpdateData {
  username?: string;
  bio?: string;
  id: number;
}

interface CreatePostData {
  title: string;
  body?: string;
  userId: number;
}

interface UpdatePostData {
  title?: string;
  body?: string;
  postId: number;
}

interface EditPostParams {
  postId: number;
  title?: string;
  body?: string;
  userId: number;
}

interface PostLikeData {
  postId: number;
  userId: number;
}

interface CommentLikeData {
  commentId: number;
  userId: number;
}

interface CreateCommentData {
  postId: number;
  userId: number;
  content: string;
}

interface updateCommentData {
  commentId: number;
  userId: number;
  content: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export {
  UserData,
  UserUpdateData,
  CreatePostData,
  UpdatePostData,
  EditPostParams,
  PostLikeData,
  CreateCommentData,
  updateCommentData,
  CommentLikeData,
};
