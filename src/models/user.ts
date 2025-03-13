import { PrismaClient } from "@prisma/client";
import { UserData, UserUpdateData } from "../types/types";

const prisma = new PrismaClient();

const userSelectFields = {
  username: true,
  avatarUrl: true,
  id: true,
  isGuest: true,
};

async function findUser({ username }: { username: string }) {
  try {
    const lowercaseUsername = username.toLowerCase();
    return await prisma.user.findUnique({
      where: {
        username: lowercaseUsername,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
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

async function findUserById({
  id,
  requesterId,
}: {
  id: number;
  requesterId?: number;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelectFields,
        profile: { select: { bio: true, bannerUrl: true } },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
        followers: {
          where: {
            followerId: requesterId,
            followedId: id,
          },
          select: {
            followerId: true,
          },
          take: 1,
        },
      },
    });

    if (!user) return null;

    const isFollowedByRequester = user.followers.length > 0;

    return {
      ...user,
      isFollowedByRequester,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchByUsername({ username }: { username: string }) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: {
        ...userSelectFields,
        profile: { select: { bio: true } },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createUser(userData: UserData) {
  try {
    const lowercaseUsername = userData.username.toLowerCase();
    return await prisma.user.create({
      data: {
        username: lowercaseUsername,
        password: userData.password,
        isGuest: userData.isGuest || false,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateUsername({ username, id }: UserUpdateData) {
  try {
    if (username) {
      const lowercaseUsername = username.toLowerCase();
      return await prisma.user.update({
        where: { id },
        data: { username: lowercaseUsername },
        select: {
          username: true,
          id: true,
        },
      });
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateAvatar({
  avatarUrl,
  userId,
}: {
  avatarUrl: string;
  userId: number;
}) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {
  findUser,
  fetchUsers,
  findUserById,
  fetchByUsername,
  createUser,
  updateUsername,
  updateAvatar,
};
