import { Request, Response } from 'express';
import { Comment } from '../models';
import {
  createComment,
  findAllCommentsFromTicketId,
  deleteComment,
  updateComment,
  findCommentById,
} from '../services';
import { findTicketbyId } from '../services/ticketService';
import { returnUserIdFromToken } from '../middleware/jwt';

export const createCommentHandler = async (req: Request, res: Response) => {
  try {
    const ticketId: string = req.params.ticketId;
    const userId: string = returnUserIdFromToken(req);
    const ticket = await findTicketbyId(ticketId);
    const comment: Comment = req.body;

    if (ticket) {
      const newCommentId = await createComment(comment, userId, ticketId);
      ticket.commentIds.push(newCommentId);
      return res.status(200).json({
        status: 'success',
        commentId: newCommentId,
      });
    } else {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to create comment',
    });
  }
};

export const getAllCommentFromTicketHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const ticketId: string = req.params.ticketId;
    const comments = findAllCommentsFromTicketId(ticketId);

    if (!comments) {
      return res.status(404).json({
        status: 'not found',
        error: 'comments not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      comments,
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get comments',
    });
  }
};

export const updateCommentHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const content = req.body.content;
    const commentId = req.params.commentId;
    const comment = await findCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        status: 'not found',
        error: 'project not found',
      });
    }
    if (userId === comment.authorId) {
      const updatedComment = await updateComment(commentId, content);
      return res.status(200).json({
        status: 'success',
        updatedComment,
      });
    } else {
      return res.status(401).json({
        status: 'unauthorized',
        error: 'you are not authorized to edit this comment',
      });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to update project',
    });
  }
};

export const deleteCommentHandler = async (req: Request, res: Response) => {
  try {
    const userId: string = returnUserIdFromToken(req);
    const commentId = req.params.commentId;
    const comment = await findCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        status: 'not found',
        error: 'comment not found',
      });
    }
    if (userId === comment.authorId) {
      await deleteComment(commentId);
      return res.status(200).json({
        status: 'success',
        message: 'comment deleted',
      });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to delete comment',
    });
  }
};
