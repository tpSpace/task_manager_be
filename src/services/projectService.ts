import { PrismaClient } from '@prisma/client';
import { Project } from '../models/project';

const prisma = new PrismaClient();

export const findProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  return project;
};

export const createProject = async (project: Project) => {
  const createdProject = await prisma.project.create({
    data: {
      ...project,
    },
  });

  return createdProject.id;
};

export const findAllProjectOfUser = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userId: {
        has: userId,
      },
    },
  });
  return projects;
}