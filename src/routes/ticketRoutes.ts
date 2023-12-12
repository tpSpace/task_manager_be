import express from "express";
import { validate } from "../middleware/validate";
import { ticketSchema } from "../schemas/ticketSchema";
import { validateAndAuthorizeToken } from "../middleware/jwt";
import {
createTicketHandler, getAllTicketbyProjectIdHandler,
getAllTicketbyStageIdHandler, getSingleTicketHandler, 
updatedTicketHandler, deleteTicketHandler
} from "../controllers/ticketController";

const router = express.Router();

router.post(
  "/create/:stageId",
  validate(ticketSchema),
  validateAndAuthorizeToken,
  createTicketHandler
)

router.get(
  "/get/project/:projectId",
  getAllTicketbyProjectIdHandler
)

router.get(
  "/get/project/stage/:stageId",
  getAllTicketbyStageIdHandler
)

router.put(
  "/update/:ticketId",
  validate(ticketSchema),
  updatedTicketHandler
)

router.delete(
  "/ticket/delete/:ticketId",
  deleteTicketHandler
)

export default router;
