import { PrismaClient } from "@prisma/client";
import { UserData, UserUpdateData } from "../types/types";

const prisma = new PrismaClient();

const userSelectFields = {
  username: true,
  avatarUrl: true,
};

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

async function fetchUsers() {
  try {
    return await prisma.user.findMany({
      select: userSelectFields,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findUserById({ id }: { id: number }) {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: userSelectFields,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchByUsername({ username }: { username: string }) {
  try {
    return await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        avatarUrl: true,
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

async function updateUsername({ username, id }: UserUpdateData) {
  try {
    return await prisma.user.update({
      where: { id },
      data: { username },
      select: {
        username: true,
        id: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export {
  findUser,
  fetchUsers,
  findUserById,
  fetchByUsername,
  createUser,
  updateUsername,
};
