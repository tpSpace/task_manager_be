import { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {
  createTicket,
  findAllTicketbyProjectId,
  findTicketbyId,
  findTicketbyStageId,
  updateTicket,
  deleteTicket,
  findRelationships,
  findAllAttributesOfTicket,
} from '../services/ticketService';
import { returnUserIdFromToken } from '../middleware/jwt';
import { findStageById } from '../services/stageService';

export const createTicketHandler = async (req: Request, res: Response) => {
  try {
    const ticket: Ticket = req.body;
    const stageId = req.params.stageId;
    ticket.creatorId = returnUserIdFromToken(req);

    const stage = await findStageById(stageId);

    if (!stage) {
      return res.status(404).json({
        status: 'not found',
        error: 'stage not found',
      });
    }

    const ticketId = await createTicket(ticket, stageId);

    return res.status(200).json({
      status: 'success',
      ticketId,
    });
  } catch (error) {
    console.log('error creating ticket: ', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to create ticket',
    });
  }
};

export const getSingleTicketHandler = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await findAllAttributesOfTicket(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      ticket,
    });
  } catch (error) {
    console.error('error getting ticket:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get ticket',
    });
  }
};

export const getAllTicketbyProjectIdHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const projectId = req.params.projectId;
    const tickets = await findAllTicketbyProjectId(projectId);

    if (!tickets) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      tickets,
    });
  } catch (error) {
    console.error('error getting Tickets:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get tickets',
    });
  }
};

export const getAllTicketbyStageIdHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const stageId = req.params.stageId;
    const tickets = await findTicketbyStageId(stageId);

    if (tickets.length === 0) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }

    let fullTickets = [];

    for (const ticket of tickets) {
      const fullTicket = await findAllAttributesOfTicket(ticket.ticketId);
      fullTickets.push(fullTicket);
    }

    return res.status(200).json({
      status: 'success',
      tickets: fullTickets,
    });
  } catch (error) {
    console.error('error getting tickets:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get ticket',
    });
  }
};

export const getAllRelationshipsHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await findTicketbyId(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }

    const ticketRelationship = await findRelationships(ticketId);

    if (!ticketRelationship) {
      return res.status(405).json({
        status: 'not found',
        error: 'relationship not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      ticketRelationship,
    });
  } catch (error) {
    console.error('error getting tickets:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to get ticket relationships',
    });
  }
};

export const updatedTicketHandler = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;
    const update: Ticket = req.body;
    const existingTicket = findTicketbyId(ticketId);

    if (!existingTicket) {
      return res.status(404).json({
        status: 'not found',
        error: 'ticket not found',
      });
    }

    const updatedTicket = await updateTicket(ticketId, update);
    return res.status(200).json({
      status: 'success',
      updatedTicket,
    });
  } catch (error) {
    console.error('error updating tickets:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to update ticket',
    });
  }
};

export const deleteTicketHandler = async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;

    const existingTicket = findTicketbyId(ticketId);

    if (!existingTicket) {
      return res.status(404).json({
        status: 'not found',
        error: 'Ticket not found',
      });
    }

    const deletedTicket = await deleteTicket(ticketId);
    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.error('error deleting tickets:', error);
    return res.status(500).json({
      status: 'server error',
      error: 'failed to delete ticket',
    });
  }
};
