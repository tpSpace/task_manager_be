import { PrismaClient } from '@prisma/client';
import { Project } from '../models/project';

const prisma = new PrismaClient();

export const findUniqueProject = async (id: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  return project;
};

export const createProject = async (project: Project) => {
  await prisma.project.create({
    data: {
      id: project.id,
      title: project.title,
      adminId: project.adminId,
      userId: project.userId,
      tagId: project.tagId,
      stageId: project.stageId,
      ticketId: project.ticketId,
      history: project.history,
    },
  });    
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