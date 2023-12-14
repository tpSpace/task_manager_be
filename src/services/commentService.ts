import { PrismaClient } from '@prisma/client';
import { Comment } from '../models';

const prisma = new PrismaClient();

export const createComment = async (
  comment: Comment,
  ticketId: string,
  userId: string,
) => {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      ticketId: ticketId,
      authorId: userId,
    },
  });
  return createdComment.commentId;
};
