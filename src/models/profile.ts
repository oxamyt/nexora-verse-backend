import { PrismaClient } from "@prisma/client";
import { UserUpdateData } from "../types/types";

const prisma = new PrismaClient();

async function createProfile({ id }: { id: number }) {
  try {
    return await prisma.profile.upsert({
      where: { userId: id },
      update: {},
      create: {
        userId: id,
      },
    });
  } catch (error) {
    console.error();
  }
}

async function updateBio({ bio, id }: UserUpdateData) {
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
  }
}

export { updateBio, createProfile };
