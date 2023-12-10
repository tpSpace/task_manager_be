import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import {
    createTicket, findAllTicketbyProjectId,
    findTicketbyId, findTicketbyStageId,
    updateTicket, deleteTicket
} from "../services/ticketService";
import { returnUserIdFromToken } from "../middleware/jwt";

export const createTicketHandler = async (req: Request, res: Response)=>{
    try{
        const ticket: Ticket = req.body
        ticket.creatorId = returnUserIdFromToken(req)
        const newTicketId = await createTicket(ticket)

        return res.status(200).json({
            status: "success",
            ticketId: newTicketId
        })
    }catch (error){
        console.log("Error creating ticket")
        return res.status(500).json({
            status: "server error",
            error: "Failed to create ticket"
        })
    }
}

export const getSingleTicketHandler = async (req: Request, res: Response) => {
    try {
        const ticketId = req.params.id;
        const ticket = await findTicketbyId(ticketId)

        if(!ticket){
            return res.status(404).json({
                status: "not found",
                error: "Ticket not found",
            });
        }

        return  res.status(200).json({
            ticket
        })
    } catch (error) {
        console.error("Error getting ticket:", error);
        return res.status(500).json({
          error: "Failed to get ticket",
        });
    }
}

export const getAllTicketbyProjectIdHandler = async (req: Request, res: Response) =>{
    try{
        const projectId = req.params.id
        const tickets = await findAllTicketbyProjectId(projectId)

        if(!tickets){
            return res.status(404).json({
                status: "not found",
                error: "Ticket not found",
            });
        }
        
        return res.status(200).json({
            status: "success",
            tickets
      });
    } catch (error) {
      console.error("Error getting Tickets:", error);
      return res.status(500).json({
        status: "server error",
        error: "failed to get Tickets",
      });
    }
};

export const getAllTicketbyStageIdHandler = async (req: Request, res: Response) => {
    try{
        const stageId = req.params.id
        const tickets = await findTicketbyStageId(stageId)
        if (tickets!){
            return res.status(404).json({
                status: "not found",
                error: "Ticket not found",
            });
        }

        return res.status(200).json({
            status: "success",
            tickets
      });
    } catch (error) {
      console.error("Error getting tickets:", error);
      return res.status(500).json({
        status: "server error",
        error: "failed to get ticket",
      });
    }
}

export const updatedTicketHandler = async (req: Request, res: Response) => {
    try{
        const ticketId = req.params.id
        const update: Ticket = req.body

        const existingTicket = findTicketbyId(ticketId)

        if (!existingTicket){
            return res.status(404).json({
                status: "not found",
                error: "Ticket not found",
            });
        }

        const updatedTicket = await updateTicket(ticketId,update)
        return res.status(200).json({
            status: "success",
            updatedTicket
      });
    } catch (error) {
      console.error("Error updating tickets:", error);
      return res.status(500).json({
        status: "server error",
        error: "failed to update ticket",
      });
    }
}

export const deleteTicketHandler = async(req: Request, res: Response) =>{
    try{
        const ticketId = req.params.id

        const existingTicket = findTicketbyId(ticketId)

        if (!existingTicket){
            return res.status(404).json({
                status: "not found",
                error: "Ticket not found",
            });
        }

        const deletedTicket = await deleteTicket(ticketId)
        return res.status(200).json({
            status: "success",
            ticketId
      });
    } catch (error) {
      console.error("Error deleting tickets:", error);
      return res.status(500).json({
        status: "server error",
        error: "Failed to delete ticket",
      });
    }
}