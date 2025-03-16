import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const users = [];
  const userCount = 20;

  for (let i = 0; i < userCount; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet
          .username()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "_"),
        password: faker.internet.password(),
        avatarUrl: faker.image.avatar(),
        profile: {
          create: {
            bio: faker.person.bio(),
            bannerUrl: faker.image.urlLoremFlickr({ category: "nature" }),
          },
        },
      },
    });
    users.push(user);
  }

  const posts = [];
  for (const user of users) {
    const postCount = faker.number.int({ min: 3, max: 7 });
    for (let i = 0; i < postCount; i++) {
      const post = await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraphs({ min: 1, max: 3 }),
          imageUrl: faker.datatype.boolean(0.3) ? faker.image.url() : null,
          userId: user.id,
        },
      });
      posts.push(post);
    }
  }

  const comments = [];
  for (const post of posts) {
    const commentCount = faker.number.int({ min: 0, max: 5 });
    for (let i = 0; i < commentCount; i++) {
      const comment = await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
          postId: post.id,
        },
      });
      comments.push(comment);
    }
  }

  for (const post of posts) {
    const likeCount = faker.number.int({ min: 0, max: users.length });
    const likedUsers = new Set();

    for (let i = 0; i < likeCount; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      if (!likedUsers.has(user.id)) {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: user.id,
          },
        });
        likedUsers.add(user.id);
      }
    }
  }

  for (const comment of comments) {
    const likeCount = faker.number.int({ min: 0, max: users.length });
    const likedUsers = new Set();

    for (let i = 0; i < likeCount; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      if (!likedUsers.has(user.id)) {
        await prisma.like.create({
          data: {
            commentId: comment.id,
            userId: user.id,
          },
        });
        likedUsers.add(user.id);
      }
    }
  }

  for (const user of users) {
    const followCount = faker.number.int({ min: 0, max: 5 });
    const followedUsers = new Set();

    for (let i = 0; i < followCount; i++) {
      const targetUser =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      if (targetUser.id !== user.id && !followedUsers.has(targetUser.id)) {
        await prisma.follow.create({
          data: {
            followerId: user.id,
            followedId: targetUser.id,
          },
        });
        followedUsers.add(targetUser.id);
      }
    }
  }

  for (let i = 0; i < 50; i++) {
    const [sender, receiver] = faker.helpers.shuffle(users).slice(0, 2);
    await prisma.message.create({
      data: {
        body: faker.lorem.sentence(),
        senderId: sender.id,
        receiverId: receiver.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
