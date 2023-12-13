import { PrismaClient } from "@prisma/client";
import { Tag } from "../models";

const prisma = new PrismaClient();

export const findTagById = async (tagId: string) => {
  const tag = await prisma.tag.findUnique({
    where: {
      tagId: tagId,
    },
  });
  return tag;
};

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
  return newTag.tagId;
};

export const getAllTagFromProjectId = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      projectId: projectId,
    },
  });
  let tags: Tag[] = [];
  for (let tagId of project!.tagIds) {
    tags.push(await findTagById(tagId) as Tag);
  }

  return tags;
};

