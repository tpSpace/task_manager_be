import { PrismaClient } from '@prisma/client';
import { User } from '../models/user';

const prisma = new PrismaClient();

export const findUniqueUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
  });
  return user;
};

export const createUser = async (user: User) => {
  await prisma.user.create({
    data: {
      ...user,
    },
  });    
};

export const findAllUser = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const findUniqueUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      userId: id
    },
  });
  return user;
};

export const addProjectToUser = async (userId: string, inputProjectId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      userId: userId
    },
  });

  if (user) {
    user.projectId.push(inputProjectId);

    await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        projectId: user.projectId
      },
    });
  }
  console.log(user);
}
