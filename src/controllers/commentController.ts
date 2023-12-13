import { Request, Response } from 'express';
import { Comment } from '../models/comment';
import {
  createComment,
  findAllCommentsFromTicket,
  deleteProject,
  updateProjectTitle,
  updateProjectAdmin,
} from '../services/projectService';

export const createCommentHandler = async (req: Request, res: Response) => {};

export const getAllCommentFromTicketHandler = async (
  req: Request,
  res: Response,
) => {};

export const getSingleProjectHandler = async (
  req: Request,
  res: Response,
) => {};

export const updateCommentHandler = async (req: Request, res: Response) => {};

export const deleteCommentHandler = async (req: Request, res: Response) => {};
