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
};
