import { Stage } from "./index";
export interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  creatorId: string;
  parentTicketId?: string | null;
  childTickets: string[];
  assignedUserIds: string[];
  timestamp: Date;
  due?: Date | null;
  stageId: string[];
  stage: Stage[];
  comment: Comment[];
}
