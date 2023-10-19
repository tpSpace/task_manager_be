import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUniqueUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      password: password,
    },
  });
  return user;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
};
