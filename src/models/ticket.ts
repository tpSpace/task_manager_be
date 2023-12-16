export interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  creatorId: string;

  parentTicketId: string;
  childTickets: string[];

  assignedUserIds: string[];
  deadline: Date;

  stageId: string;
  tagId: string;
  commentIds: string[];
}
