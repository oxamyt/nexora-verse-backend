import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDatabase() {
  await prisma.user.deleteMany();
}

export { cleanupDatabase };
