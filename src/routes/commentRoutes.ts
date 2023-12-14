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

const stageRouter = express.Router();

stageRouter.post(
  '/create/:ticketId',
  validate(commentSchema),
  validateAndAuthorizeToken,
  createCommentHandler,
);

stageRouter.get(
  '/getComment/:ticketId',
  validateAndAuthorizeToken,
  getAllCommentFromTicketHandler,
);

stageRouter.put(
  '/updateComment/:commentId',
  validateAndAuthorizeToken,
  updateCommentHandler,
);

stageRouter.delete(
  '/delete/:commentId',
  validateAndAuthorizeToken,
  deleteCommentHandler,
);

export default stageRouter;
