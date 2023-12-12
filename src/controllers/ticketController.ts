import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
  createTicket,
  findAllTicketbyProjectId,
  findTicketbyId,
  findTicketbyStageId,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";
import { returnUserIdFromToken } from "../middleware/jwt";
import { HttpStatusCode, Action, FastResponse } from "./abstraction";

export const createTicketHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const ticket: Ticket = req.body;
    const stageId = req.params.stageId;
    ticket.creatorId = returnUserIdFromToken(req);
    const newTicketId = await createTicket(ticket, stageId);

    return fr.buildSuccess(newTicketId);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.CREATE);
  }
};

export const getSingleTicketHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const ticketId = req.params.id;
    const ticket = await findTicketbyId(ticketId);

    if (!ticket) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    return fr.buildSuccess({ ticket });
  } catch (error) {
    console.error("Error getting ticket:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.GET);
  }
};

export const getAllTicketbyProjectIdHandler = async (
  req: Request,
  res: Response
) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const projectId = req.params.id;
    const tickets = await findAllTicketbyProjectId(projectId);

    if (!tickets) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    return fr.buildSuccess({ tickets });
  } catch (error) {
    console.error("Error getting Tickets:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.GET);
  }
};

export const getAllTicketbyStageIdHandler = async (
  req: Request,
  res: Response
) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const stageId = req.params.id;
    const tickets = await findTicketbyStageId(stageId);

    if (!tickets) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    return fr.buildSuccess({ tickets });
  } catch (error) {
    console.error("Error getting tickets:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.GET);
  }
};

export const updatedTicketHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const ticketId = req.params.id;
    const update: Ticket = req.body;

    const existingTicket = await findTicketbyId(ticketId);

    if (!existingTicket) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    const updatedTicket = await updateTicket(ticketId, update);
    return fr.buildSuccess({ updatedTicket });
  } catch (error) {
    console.error("Error updating tickets:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.UPDATE);
  }
};

export const deleteTicketHandler = async (req: Request, res: Response) => {
  const fr = new FastResponse(res, "Ticket");
  try {
    const ticketId = req.params.id;

    const existingTicket = await findTicketbyId(ticketId);

    if (!existingTicket) {
      return fr.buildError(HttpStatusCode.NOTFOUND);
    }

    const deletedTicket = await deleteTicket(ticketId);
    return fr.buildSuccess({ ticketId });
  } catch (error) {
    console.error("Error deleting tickets:", error);
    return fr.buildError(HttpStatusCode.SERVERERROR, Action.DELETE);
  }
};
