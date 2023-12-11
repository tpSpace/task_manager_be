import { PrismaClient } from '@prisma/client';
import { Ticket } from '../models/ticket';


const prisma = new PrismaClient();

export const addChildTicket = async (parentId: string, childId: string) =>{
    const parentTicket = await prisma.ticket.findUnique({
        where:{
            ticketId: parentId
        }
    })
    parentTicket?.childTickets.push(childId)
}

export const deleteChildTicket = async (parentId: string, childId: string) =>{
    const parentTicket = await prisma.ticket.findUnique({
        where:{
            ticketId: parentId
        }
    })
    parentTicket?.childTickets.forEach( c => {
        if (c === childId){
            parentTicket.childTickets.splice(parentTicket.childTickets.indexOf(c))
            return
        }
    }
    )
}
export const createTicket = async (ticket: Ticket, stageId: string) => {
  const createdTicket = await prisma.ticket.create({
      data: {
        creatorId: ticket.creatorId,
        title: ticket.title,
        description: ticket.description,
        assignedUserIds: ticket.assignedUserIds,
        deadline: ticket.deadline,
        parentTicketId: ticket.parentTicketId,
      },
    });
  await prisma.stage.update({
      where: {
        stageId: stageId
      },
      data: {
        ticketIds: {
          push: createdTicket.ticketId
        }
      }
    })
  if (ticket.parentTicketId)
    addChildTicket(ticket.parentTicketId, createdTicket.ticketId)
  return createdTicket
}

export const findTicketbyId = async (ticketId: string) => {
    return await prisma.ticket.findUnique({
        where:{
            ticketId: ticketId
        }
    })
}

export const findAllTicketbyProjectId = async (inputProjectId: string) => {
    const stages = await prisma.stage.findMany({
        select: {
            stageId: true,
        },
        where: {
            projectIds: {
                has: inputProjectId
            }
        }
    })
    let ticketArray = []

    for(const s in stages){
        return findTicketbyStageId(s)
        // const tickets = await prisma.ticket.findMany({
        //     select:{
        //         ticketId: true
        //     },
        //     where:{
        //         stageId: {
        //             has: s,
        //         }
        //     }
        // })
        // for(const t in tickets){
        //     const ticket = await prisma.ticket.findFirst({
        //         where:{
        //             ticketId: t
        //         }
        //     })
        //     ticketArray.push(ticket)
        // }
    }   
    // return ticketArray.map((ticket)=> {
    //     return{
    //         ticketId: ticket?.ticketId,
    //         title: ticket?.title,
    //     }
    // })
    }   

    export const findTicketbyStageId = async (stageId: string) =>  {
        const ticketArray = await prisma.ticket.findMany({
            where:{
                stageId: {
                    has: stageId,
                }
            }
        })

        return ticketArray.map((ticket)=> {
            return{
                ticketId: ticket?.ticketId,
                title: ticket?.title,
            }
        })
    }

    export const updateTicket = async (ticketId: string, updateTicket: Ticket) =>{
        const oldTicket = await prisma.ticket.findUnique({
            where:{
                ticketId: ticketId
            }
        })

        const updatedTicket = await prisma.ticket.update({
            where: {
              ticketId: ticketId
            },
            data: {
              title: updateTicket.title,
              description: updateTicket.description,
              assignedUserIds: updateTicket.assignedUserIds,
              deadline: updateTicket.deadline,
              parentTicketId: updateTicket.parentTicketId,
            },
          });        

        if(updatedTicket.parentTicketId != oldTicket?.parentTicketId 
            && updatedTicket.parentTicketId){
            if(!oldTicket?.parentTicketId)
                addChildTicket(updatedTicket.parentTicketId,ticketId)
            else if(oldTicket?.parentTicketId){
                deleteChildTicket(oldTicket.parentTicketId, ticketId)
                addChildTicket(updatedTicket.parentTicketId,ticketId)
            }
        }

        return updatedTicket;
    }

    export const deleteTicket = async (ticketId: string) =>{
        const deletedTicket = await prisma.ticket.delete({
            where: {
              ticketId: ticketId
            }
          });
          return deletedTicket;
    }