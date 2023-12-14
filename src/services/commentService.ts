import { PrismaClient } from '@prisma/client';
import { Comment } from '../models';

const prisma = new PrismaClient();

export const createComment = async (
  comment: Comment,
  userId: string,
  ticketId: string,
) => {
  const createdComment = await prisma.comment.create({
    data: {
      content: comment.content,
      authorId: userId,
      ticketId: ticketId,
    },
  });
  return createdComment.commentId;
};

export const findAllCommentsFromTicketId = async (ticketId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      ticketId: ticketId,
    },
  });
  return comments;
};
