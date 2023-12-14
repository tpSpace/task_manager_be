import { commentSchema } from '../schemas';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createCommentHandler,
  getAllCommentFromTicketHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers/commentController';

import express from 'express';

const commentRouter = express.Router();

commentRouter.post(
  '/create/:ticketId',
  // validate(commentSchema),
  validateAndAuthorizeToken,
  createCommentHandler,
);

commentRouter.get(
  '/getComment/:ticketId',
  validateAndAuthorizeToken,
  getAllCommentFromTicketHandler,
);

commentRouter.put(
  '/updateComment/:commentId',
  validateAndAuthorizeToken,
  updateCommentHandler,
);

commentRouter.delete(
  '/delete/:commentId',
  validateAndAuthorizeToken,
  deleteCommentHandler,
);

export default commentRouter;
