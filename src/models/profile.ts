import { PrismaClient } from "@prisma/client";
import { UserUpdateData } from "../types/types";

const prisma = new PrismaClient();

async function createProfile({ userId }: { userId: number }) {
  try {
    return await prisma.profile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateProfileBio({ bio, id }: UserUpdateData) {
  try {
    return await prisma.profile.update({
      where: { userId: id },
      data: { bio },
      select: {
        id: true,
        bio: true,
        userId: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateBanner({
  bannerUrl,
  userId,
}: {
  bannerUrl: string;
  userId: number;
}) {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: {
        bannerUrl,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { updateProfileBio, createProfile, updateBanner };
