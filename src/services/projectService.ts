import { PrismaClient } from '@prisma/client';
import { Project } from '../models/project';

const prisma = new PrismaClient();

export const findProjectById = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      projectId: projectId,
    },
  });
  return project;
};

export const createProject = async (project: Project) => {
  let userIds = [];
  userIds.push(project.adminId);

  const createdProject = await prisma.project.create({
    data: {
      title: project.title,
      adminId: project.adminId,
      userIds: userIds,
    },
  });
  return createdProject.projectId;
};

export const findAllProjectOfUserWithId = async (inputUserId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userIds: {
        has: inputUserId
      }
    },
  });

  return projects.map((project) => {
    return {
      projectId: project.projectId,
      title: project.title,
    };
  });
}