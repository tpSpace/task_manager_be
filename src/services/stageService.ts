import { PrismaClient } from '@prisma/client';
import { Stage } from '../models/stage';

const prisma = new PrismaClient();

export const findStageById = async (stageId: string) => {
  const stage = await prisma.stage.findUnique({
    where: {
      stageId: stageId,
    },
  });
  return stage;
};

export const createStage = async (stage: Stage, projectId: string) => {
  const newStage = await prisma.stage.create({
    data: {
      title: stage.title,
      ticketIds: [],
    },
  });

  // Add stageId to project entity
  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      stageIds: {
        push: newStage.stageId,
      },
    },
  });
  return newStage.stageId;
};

export const findAllStageFromProjectId = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      projectId: projectId,
    },
  });
  let stages: Stage[] = [];
  for (let stageId of project!.stageIds) {
    stages.push((await findStageById(stageId)) as Stage);
  }

  return stages;
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
  return updated.title;
};

export const deleteStage = async (stageId: string) => {
  const deletedStage = await prisma.stage.delete({
    where: {
      stageId: stageId,
    },
  });
  return deletedStage;
};
