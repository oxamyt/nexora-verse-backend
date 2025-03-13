import { findUser } from "../models/user";

export async function generateUniqueGuestUsername(): Promise<string> {
  let username: string;
  let isUnique = false;

  while (!isUnique) {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    username = `Guest${randomSuffix}`;
    const existingUser = await findUser({ username });
    if (!existingUser) isUnique = true;
  }

  return username!;
}
