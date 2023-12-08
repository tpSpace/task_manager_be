import { PrismaClient } from '@prisma/client';
import { Tag } from '../models/tag';

const prisma = new PrismaClient();

export const createTag = async (tag: Tag) => {
    await prisma.tag.create({
        data: {
            ...tag,
        },
    });
};

// export const deleteTag = async (id: string) =>{
//     const tag = await prisma.project.findUnique({
//         where: {
//             id: id,
//         },
//     });
//     return null;
// }