import { PrismaClient } from '@prisma/client';
import { Ticket } from '../models/ticket';

const prisma = new PrismaClient();

export const createTicket = async (ticket: Ticket, stageId: string) => {
  let stageIds = [];
  stageIds.push(stageId);

  const createdTicket = await prisma.ticket.create({
    data: {
      title: ticket.title,
      description: ticket.description,
      creatorId: ticket.creatorId,
      assignedUserIds: ticket.assignedUserIds,
      deadline: ticket.deadline,
      parentTicketId: ticket.parentTicketId,
      stageId: stageId,
      tagId: ticket.tagId,
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

  return createdTicket;
};

export const findTicketbyId = async (ticketId: string) => {
  const ticket = await prisma.ticket.findUnique({
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

  if (
    updatedTicket.parentTicketId != oldTicket?.parentTicketId &&
    updatedTicket.parentTicketId
  ) {
    if (!oldTicket?.parentTicketId)
      addChildTicket(updatedTicket.parentTicketId, inputTicketId);
    else if (oldTicket?.parentTicketId) {
      deleteChildTicket(oldTicket.parentTicketId, inputTicketId);
      addChildTicket(updatedTicket.parentTicketId, inputTicketId);
    }
  }
  return updatedTicket;
};

export const deleteTicket = async (ticketId: string) => {
  const parentTicket = await prisma.ticket.findFirst({
    where: {
      childTickets: {
        has: ticketId,
      },
    },
  });
  if (parentTicket) {
    deleteChildTicket(parentTicket.ticketId, ticketId);
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
  const deletedTicket = await prisma.ticket.delete({
    where: {
      ticketId: ticketId,
    },
  });
  return deletedTicket;
};

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
  // const parentTicket = await prisma.ticket.findUnique({
  //   where: {
  //     ticketId: parentId,
  //   },
  // });
  // parentTicket?.childTickets.forEach((c) => {
  //   if (c === childId) {
  //     parentTicket.childTickets.splice(parentTicket.childTickets.indexOf(c));
  //     return
  //   }
  // })
};