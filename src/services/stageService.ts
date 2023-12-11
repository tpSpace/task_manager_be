import { PrismaClient } from "@prisma/client";
import { Stage, Project } from "../models";

const prisma = new PrismaClient();

export const findStageById = async (stageId: string) => {
  const stage = await prisma.stage.findUnique({
    where: {
      stageId: stageId,
    },
  });
  return stage;
};

export const createStage = async (stage: Stage, projectId: String) => {
  let projectIds = [];
  projectIds.push(projectId);
  const newStage = await prisma.stage.create({
    data: {
      title: stage.title,
    },
  });
  return newStage.stageId;
};

export const findAllStageFromProjectId = async (projectId: string) => {
  const stage = await prisma.stage.findMany({
    where: {
      projectIds: {
        has: projectId,
      },
    },
  });
  return stage.map((stage) => {
    return {
      stageId: stage.stageId,
      title: stage.title,
    };
  });
};

export const updateStage = async (stageId: string, updatedStage: Stage) => {
  const updated = await prisma.stage.update({
    where: {
      stageId: stageId,
    },
    data: {
      title: updatedStage.title,
    },
  });
  return updated;
};

export const deleteStage = async (stageId: string) => {
  const deletedStage = await prisma.stage.delete({
    where: {
      stageId: stageId,
    },
  });
  return deletedStage;
};
