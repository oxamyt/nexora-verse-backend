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
  id: number;
}

interface UpdatePostData {
  title?: string;
  body?: string;
  postId: number;
}

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export { UserData, UserUpdateData, CreatePostData, UpdatePostData };
