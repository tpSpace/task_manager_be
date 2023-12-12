import express from 'express';
import { validate } from '../middleware/validate';
import { ticketSchema } from '../schemas/ticketSchema';
import { validateAndAuthorizeToken } from '../middleware/jwt';
import {
  createTicketHandler,
  getAllTicketbyProjectIdHandler,
  getAllTicketbyStageIdHandler,
  getSingleTicketHandler,
  updatedTicketHandler,
  deleteTicketHandler,
} from '../controllers/ticketController';

const router = express.Router();

router.post(
  '/create/:stageId',
  validate(ticketSchema),
  validateAndAuthorizeToken,
  createTicketHandler,
);

router.get(
  '/get/project/:id',
  validateAndAuthorizeToken, 
  getAllTicketbyProjectIdHandler
);

router.get(
  '/get/project/stage/:id',
  validateAndAuthorizeToken, 
  getAllTicketbyStageIdHandler
);

router.put(
  '/update/:id', 
  validate(ticketSchema),
  validateAndAuthorizeToken, 
  updatedTicketHandler
);

router.delete(
  '/ticket/delete/:ticketId',
  validateAndAuthorizeToken, 
  deleteTicketHandler
);

export default router;
