interface UserData {
  username: string;
  password: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export { UserData };
