import { PrismaClient, User } from '@prisma/client';
import { Ticket } from '../models/ticket';
import { findStageById } from './stageService';
import { findTagById } from './tagService';
import { findUserById } from './userService';
import { findAllCommentsByTicketId, deleteAllCommentsByTicketId } from './commentService';

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

  return createdTicket.ticketId;
};

export const findTicketbyId = async (ticketId: string) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  return ticket;
};

export const findRelationships = async (ticketId: string) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
  if (!ticket) return;

  const parentTicket = await prisma.ticket.findFirst({
    where: {
      ticketId: ticket.parentTicketId,
    },
  });

  const childTickets: Ticket[] = [];
  for (const childTicketId of ticket.childTickets) {
    const childTicket = await prisma.ticket.findFirst({
      where: {
        ticketId: childTicketId,
      },
    });
    if (childTicket) childTickets.push(childTicket);
  }

  return {
    parentTicket,
    childTickets,
  };
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
  newTagId: string,
  newStageId: string,
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
      childTickets: updateTicket.childTickets,
      tagId: newTagId,
      stageId: newStageId,
    },
  });
  
  // Check if stageId has changed and update related data
  if (updatedTicket.stageId !== oldTicket?.stageId) {
    const oldStage = await prisma.stage.findFirst({
      select: {
        ticketIds: true,
      },
      where: {
        ticketIds: {
          has: inputTicketId,
        },
      },
    });

    if (oldStage) {
      oldStage.ticketIds.splice(oldStage.ticketIds.indexOf(inputTicketId), 1);
      await prisma.stage.updateMany({
        where: {
          ticketIds: {
            has: inputTicketId,
          },
        },
        data: {
          ticketIds: {
            set: oldStage.ticketIds,
          },
        },
      });
    }
    await prisma.stage.update({
      where: {
        stageId: newStageId,
      },
      data: {
        ticketIds: {
          push: inputTicketId,
        },
      },
    });
  };


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

  //Remove all of the comments within that ticket
  await deleteAllCommentsByTicketId(ticketId);
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

export const findAllAttributesOfTicket = async (ticketId: string) => {
  const ticket = await findTicketbyId(ticketId);
  
  let stage = null;
  let tag = null;
  let creator = null;
  let comments: any = [];
  let assignedUsers: any = [];

  if (ticket!.stageId){
    stage = await findStageById(ticket!.stageId);
  }

  if (ticket!.tagId){
    tag = await findTagById(ticket!.tagId);
  }

  if (ticket!.commentIds){
    comments = await findAllCommentsByTicketId(ticketId);
  }

  if (ticket!.creatorId){
    creator = await prisma.user.findUnique({
      where: {
        userId: ticket!.creatorId,
      },
    });
  }

  if (ticket!.assignedUserIds.length > 0){
    for (const assignedUserId of ticket!.assignedUserIds){
      const user = await findUserById(assignedUserId);
      assignedUsers.push(user);
    } 
  }

  return {
    ticketId: ticket?.ticketId,
    title: ticket?.title,
    description: ticket?.description,
    parentTicketId: ticket?.parentTicketId,
    childTickets: ticket?.childTickets,
    deadline: ticket?.deadline,

    stage: {
      stageId: stage?.stageId,
      title: stage?.title,
    },
    tag:{
      tagId: tag?.tagId,
      title: tag?.title,
      priority: tag?.priority,
      colour: tag?.colour,
    },
    creator: {
      creatorId: creator?.userId,
      name: creator?.name,
      email: creator?.email,
    },
    assignedUsers,
    comments,
  };
};
 
export async function MoveTicket(ticketId: string, stageId: string) {
  const stage = await prisma.stage.findUnique({
    where: {
      stageId: stageId,
    },
  });
  const ticket = await prisma.ticket.findUnique({
    where: {
      ticketId: ticketId,
    },
  });
  try {
  if (stage?.ticketIds !== undefined && ticket?.stageId !== undefined) {
    if (stage && stage.ticketIds) {
      stage.ticketIds = stage.ticketIds.filter((id) => id !== ticketId);
    }
    prisma.ticket.update({
      where: {
        ticketId: ticketId,
      },
      data: {
        stageId: stageId,
      },
    });

    await prisma.stage.update({
      where: {
        stageId: stageId,
      },
      data: {
        ticketIds: {
          set: stage.ticketIds,
        },
      },
    });
  }
  } catch (error) {
    console.error('error moving tickets:', error);
    return error;
  }
}