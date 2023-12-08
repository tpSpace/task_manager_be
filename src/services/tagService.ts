import { PrismaClient } from '@prisma/client';
import { Tag } from '../models/tag';

const prisma = new PrismaClient();

export const createTag = async (tag: Tag) => {
     const newTag = await prisma.tag.create({
         data: {
            ...tag,
        },
    });
    return newTag.id;
};
export const getAllTagOfProjectId = async (projectId: string) => {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId
        }
    });
    if (project){
        const tag = await prisma.tag.findMany({
            where: {
                id:{
                   in: project.tagId
                }
            },
        });
        if (!tag){
            throw new Error("Tag not found");
        }
        return tag;
    }
}
