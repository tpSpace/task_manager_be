import { Stage } from '.';
export interface Ticket {
  ticketId: string;
  title: string;
  description?: string | null;
  creatorId: string;
  parentTicketId?: string | null;
  childTickets: string[];

  assignedUserIds: string[];
  deadline?: Date | null;

  stageId: string[];
  stage: Stage[];

  comment: Comment[];
}
