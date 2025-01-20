import { PrismaClient } from "@prisma/client";
import { UserData } from "../types/types";

const prisma = new PrismaClient();

async function findUser({ username }: { username: string }) {
  try {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

async function createUser({ username, password }: UserData) {
  try {
    return await prisma.user.create({
      data: {
        username,
        password,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export { findUser, createUser };
