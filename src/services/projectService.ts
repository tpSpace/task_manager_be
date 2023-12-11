import { PrismaClient } from "@prisma/client";
import { Project } from "../models";


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
        has: inputUserId,
      },
    },
  });

  return projects.map((project) => {
    return {
      projectId: project.projectId,
      title: project.title,
    };
  });
}

export const updateProject = async (projectId: string, project: Project) => {
  const updatedProject = await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data:{
      title: project.title,
    },
  });
  return updatedProject.title;
}
export const deleteProject = async (projectId: string) => {
  await prisma.project.delete({
    where: {
      projectId: projectId,
    },
  });
}
