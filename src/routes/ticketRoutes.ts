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
  getAllRelationshipsHandler,
} from '../controllers/ticketController';

const router = express.Router();

router.post(
  '/create/:stageId',
  validate(ticketSchema),
  validateAndAuthorizeToken,
  createTicketHandler,
);

router.get(
  '/get/project/:projectId',
  validateAndAuthorizeToken,
  getAllTicketbyProjectIdHandler,
);

router.get(
  '/get/ticket/:ticketId',
  validateAndAuthorizeToken,
  getSingleTicketHandler,
);

router.get(
  '/get/stage/:stageId',
  validateAndAuthorizeToken,
  getAllTicketbyStageIdHandler,
);

router.get(
  '/get/relationship/:ticketId',
  validateAndAuthorizeToken,
  getAllRelationshipsHandler,
)

router.put(
  '/update/:ticketId',
  validateAndAuthorizeToken,
  updatedTicketHandler,
);

router.delete(
  '/delete/:ticketId',
  validateAndAuthorizeToken,
  deleteTicketHandler,
);

export default router;
