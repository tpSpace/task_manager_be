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
    const comment: Comment = req.body;
    console.log(comment);

    const userId: string = returnUserIdFromToken(req);
    const ticketId: string = req.params.ticketId;

    const ticket = await findTicketbyId(ticketId);
    if (!ticket) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }
    const newCommentId = await createComment(comment, userId, ticketId);

    return res.status(200).json({
      status: 'success',
      newCommentId,
    });
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
    const comments = await findAllCommentsFromTicketId(ticketId);

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

    console.log(req.body);

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
