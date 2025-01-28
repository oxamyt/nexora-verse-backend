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

interface FollowData {
  followerId: number;
  followedId: number;
}

interface RetrieveMessagesData {
  userId: number;
  targetId: number;
}

interface MessageData {
  body: string;
  senderId: number;
  receiverId: number;
}

declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      _query: Record<string, string>;
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
  FollowData,
  RetrieveMessagesData,
  MessageData,
};
