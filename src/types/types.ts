interface UserData {
  username: string;
  password: string;
}

interface UserUpdateData {
  username?: string;
  bio?: string;
  id: number;
}

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export { UserData, UserUpdateData };
