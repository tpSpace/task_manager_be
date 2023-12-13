import { commentSchema } from '../schemas/commentSchema';
import { validate } from '../middleware/validate';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createCommentHandler,
  getAllCommentFromTicketHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers';

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
  '/updateComment/:tickerId',
  validateAndAuthorizeToken,
  updateCommentHandler,
);

stageRouter.delete(
  '/delete/:ticketId',
  validateAndAuthorizeToken,
  deleteCommentHandler,
);

export default stageRouter;
