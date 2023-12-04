import { User } from "./index";
export interface Ticket {
  id: string;
  commentId: string[];
  tagId: string;
  title: string;
  description: string;
  creatorId: string;
  assignedUserId: string | null;
  parentTicketId: string;
  childTicketId: string[];
}
