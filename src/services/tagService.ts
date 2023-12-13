import { PrismaClient } from "@prisma/client";
import { Tag } from "../models";

const prisma = new PrismaClient();

export const createTag = async (tag: Tag, projectId: string) => {
  let projectIds = [];
  projectIds.push(projectId);
  const newTag = await prisma.tag.create({
    data: {
      title: tag.title,
      priority: tag.priority,
      colour: tag.colour,
    },
  });

  // Add tagId to project entity
  await prisma.project.update({
    where: {
      projectId: projectId,
    },
    data: {
      tagIds: {
        push: newTag.tagId,
      },
    },
  });
  return newTag.tagId;
};

export const getAllTagFromProjectId = async (projectId: string) => {
  const tag = await prisma.tag.findMany({
    where: {
      projectIds: {
        has: projectId,
      },
    },
  });
  return tag.map((tag) => {
    return {
      tagId: tag.tagId,
      title: tag.title,
      priority: tag.priority,
      colour: tag.colour,
    };
  });
};

