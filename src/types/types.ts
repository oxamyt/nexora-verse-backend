import type { Express } from "express";
interface UserData {
  username: string;
  password?: string;
  isGuest?: boolean;
}

interface UserUpdateData {
  username?: string;
  bio?: string;
  id: number;
}

interface CreatePostData {
  title: string;
  body?: string;
  imageUrl?: string;
  userId: number;
  file?: Express.Multer.File;
}

interface UpdatePostData {
  title?: string;
  body?: string;
  postId: number;
  imageUrl?: string;
}

interface EditPostParams {
  postId: number;
  title?: string;
  body?: string;
  userId: number;
  file?: Express.Multer.File;
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

interface UpdateCommentData {
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

interface UpdateMessageData {
  body: string;
  senderId: number;
  messageId: number;
}

interface UpdateMessageModel {
  body: string;
  id: number;
}

interface DeleteMessageData {
  messageId: number;
  senderId: number;
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
  UpdateCommentData,
  CommentLikeData,
  FollowData,
  RetrieveMessagesData,
  MessageData,
  UpdateMessageData,
  UpdateMessageModel,
  DeleteMessageData,
};
