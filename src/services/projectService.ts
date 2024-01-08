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
      history: [],
      tagIds: [],
      stageIds: [],
    },
  });

  // Add project to user
  await prisma.user.update({
    where: {
      userId: project.adminId,
    },
    data: {
      projectIds: {
        push: createdProject.projectId,
      },
    },
  });
  return createdProject.projectId;
};

export const findProjectByUserId = async (inputUserId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userIds: {
        has: inputUserId,
      },
    },
  });

  return projects;
};

export const findProjectByTagId = async (tagId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      tagIds: {
        has: tagId,
      },
    },
  });
  return project;
};

export const findProjectByStageId = async (stageId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      stageIds: {
        has: stageId,
      },
    },
  });
  return project;
};


export const updateProjectTitle = async (
  projectId: string,
  project: Project,
) => {
  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      title: project.title,
    },
  });
};

export const addUserToProject = async (projectId: string, userId: string) => {
  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      userIds: {
        push: userId,
      },
    },
  });

  await prisma.user.update({
    where: {
      userId: userId,
    },
    data: {
      projectIds: {
        push: projectId,
      },
    },
  });
};

export const removeUserFromProject = async (projectId: string, userId: string) => {
  const project = await findProjectById(projectId);
  let newUserIds = [];
  newUserIds = project!.userIds.filter(
    (id: string) => id !== userId
  );

  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      userIds: {
        set: newUserIds,
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });

  let newProjectIds = [];
  newProjectIds = user!.projectIds.filter(
    (id: string) => id !== projectId
  );
  
  await prisma.user.update({
    where: {
      userId: userId,
    },
    data: {
      projectIds: {
        set: newProjectIds,
      },
    },
  });
};
export const updateProjectAdmin = async (
  projectId: string,
  adminId: string,
) => {
  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      adminId: adminId,
    },
  });
};

export const deleteProject = async (projectId: string) => {
  await prisma.project.delete({
    where: {
      projectId: projectId,
    },
  });
};


