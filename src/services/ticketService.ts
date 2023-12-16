import { PrismaClient } from '@prisma/client';
import { Ticket } from '../models/ticket';
import { nullable } from 'zod';

const prisma = new PrismaClient();

export const createTicket = async (ticket: Ticket, stageId: string) => {
  if (!ticket.parentTicketId) ticket.parentTicketId = '';
  if (!ticket.childTickets) ticket.childTickets = [];
  if (!ticket.assignedUserIds) ticket.assignedUserIds = [];
  if (!ticket.deadline) ticket.deadline = new Date();
  if (!ticket.tagId) ticket.tagId = '';
  if (!ticket.description) ticket.description = '';
  if (!ticket.commentIds) ticket.commentIds = [];

  const createdTicket = await prisma.ticket.create({
    data: {
      title: ticket.title,
      description: ticket.description,
      creatorId: ticket.creatorId,
      assignedUserIds: ticket.assignedUserIds,
      deadline: ticket.deadline,
      parentTicketId: ticket.parentTicketId,
      childTickets: ticket.childTickets,
      stageId: stageId,
      tagId: ticket.tagId,
      commentIds: ticket.commentIds,
    },
  });

  // Add ticket to stage
  await prisma.stage.update({
    where: {
      stageId: stageId,
    },
    data: {
      ticketIds: {
        push: createdTicket.ticketId,
      },
    },
  });

  if (ticket.parentTicketId)
    addChildTicket(ticket.parentTicketId, createdTicket.ticketId);

  if (ticket.childTickets) {
    for (const childTicketId of ticket.childTickets) {
      const childTicket = await prisma.ticket.findFirst({
        where: {
          ticketId: childTicketId,
        },
      });
      if (childTicket)
        await deleteChildTicket(childTicket.parentTicketId, childTicketId);
      addParentTicket(createdTicket.ticketId, childTicketId);
    }
  }

  return createdTicket;
};

export const findTicketbyId = async (ticketId: string) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return ticket;
};

export const findAllTicketbyProjectId = async (inputProjectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      projectId: inputProjectId,
    },
  });

  if (!project) return;

  // Find all tickets in the project
  let tickets: Ticket[] = [];
  for (let stageId of project.stageIds) {
    const ticketArray = await prisma.ticket.findMany({
      where: {
        stageId: stageId,
      },
    });

    for (let ticket of ticketArray) {
      tickets.push({
        ...ticket,
      });
    }
  }
  return tickets;
};

export const findTicketbyStageId = async (stageId: string) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      stageId: stageId,
    },
  });
  return tickets;
};

export const updateTicket = async (
  inputTicketId: string,
  updateTicket: Ticket,
) => {
  const oldTicket = await prisma.ticket.findUnique({
    where: {
      ticketId: inputTicketId,
    },
  });

  const updatedTicket = await prisma.ticket.update({
    where: {
      ticketId: inputTicketId,
    },
    data: {
      title: updateTicket.title,
      description: updateTicket.description,
      assignedUserIds: updateTicket.assignedUserIds,
      deadline: updateTicket.deadline,
      parentTicketId: updateTicket.parentTicketId,
    },
  });

  if (updatedTicket.childTickets !== oldTicket?.childTickets) {
    deleteParentTicketId(inputTicketId);
    for (const childTicketId of updatedTicket.childTickets)
      addParentTicket(updatedTicket.ticketId, childTicketId);
  }

  if (updatedTicket.parentTicketId !== oldTicket?.parentTicketId) {
    if (!oldTicket?.parentTicketId) {
      addChildTicket(updatedTicket.parentTicketId, inputTicketId);
    } else if (oldTicket?.parentTicketId) {
      deleteChildTicket(oldTicket.parentTicketId, inputTicketId);
      addChildTicket(updatedTicket.parentTicketId, inputTicketId);
    }
  }
  return updatedTicket;
};

export const deleteTicket = async (ticketId: string) => {
  const deletedTicket = await prisma.ticket.delete({
    where: {
      ticketId: ticketId,
    },
  });

  if (deletedTicket.parentTicketId) {
    deleteChildTicket(deletedTicket.parentTicketId, ticketId);
  }

  if (deletedTicket.childTickets) {
    deleteParentTicketId(ticketId);
  }
  const stage = await prisma.stage.findFirst({
    select: {
      ticketIds: true,
    },
    where: {
      ticketIds: {
        has: ticketId,
      },
    },
  });
  if (stage) {
    stage.ticketIds.splice(stage.ticketIds.indexOf(ticketId), 1);
    await prisma.stage.updateMany({
      where: {
        ticketIds: {
          has: ticketId,
        },
      },
      data: {
        ticketIds: {
          set: stage.ticketIds,
        },
      },
    });
  }
  return deletedTicket;
};

//to add childTicketIds into a parent ticket
export const addChildTicket = async (parentId: string, childId: string) => {
  return await prisma.ticket.update({
    where: {
      ticketId: parentId,
    },
    data: {
      childTickets: {
        push: childId,
      },
    },
  });
};

//to add parentTicketId to a child ticket
export const addParentTicket = async (parentId: string, childId: string) => {
  return await prisma.ticket.update({
    where: {
      ticketId: childId,
    },
    data: {
      parentTicketId: parentId,
    },
  });
};

//to remove childTicketId when a child ticket is deleted
export const deleteChildTicket = async (parentId: string, childId: string) => {
  const parentTicket = await prisma.ticket.findFirst({
    select: {
      childTickets: true,
    },
    where: {
      ticketId: parentId,
    },
  });
  parentTicket?.childTickets.splice(
    parentTicket.childTickets.indexOf(childId),
    1,
  );
  return await prisma.ticket.update({
    where: {
      ticketId: parentId,
    },
    data: {
      childTickets: {
        set: parentTicket?.childTickets,
      },
    },
  });
};

//to remove parentTicketId of children ticket when a ticket is deleted
export const deleteParentTicketId = async (parentId: string) => {
  return await prisma.ticket.updateMany({
    where: {
      parentTicketId: parentId,
    },
    data: {
      parentTicketId: '',
    },
  });
};
