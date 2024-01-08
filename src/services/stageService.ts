import { PrismaClient } from '@prisma/client';
import { Stage } from '../models/stage';
import { findProjectByStageId } from './projectService';
import { deleteAllCommentsByTicketId } from './commentService';

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
  // Remove stageId from project entity
  const project = await findProjectByStageId(stageId);

  let newStageIds = project!.stageIds.filter(
    (id:string) => id !== stageId
  );

  await prisma.project.update({
    where: {
      projectId: project!.projectId,
    },
    data: {
      stageIds: newStageIds,
    },
  });

  const deleteStage = await findStageById(stageId);

  // Delete all tickets in stage
  for (const ticket of deleteStage!.ticketIds) {
    await prisma.ticket.delete({
      where: {
        ticketId: ticket,
      },
    });
    await deleteAllCommentsByTicketId(ticket);
  };

  await prisma.stage.delete({
    where: {
      stageId: stageId,
    },
  });
};
