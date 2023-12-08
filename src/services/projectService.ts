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

export const findAllProjectOfUserWithId = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userId: {
        has: userId,
      },
    },
  });
  return projects.map((project: Project) => {
    return {
      id: project.id,
      title: project.title,
    };
  });
}

export const addTagToProject = async (projectId: string, inputTagId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
  });

  if (project) {
    project.tagId.push(inputTagId);

    await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        tagId: project.tagId
      },
    });
  }


}