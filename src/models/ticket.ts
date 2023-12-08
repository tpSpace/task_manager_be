import { User } from "./index";
export interface Ticket {
  id: string;
  commentId: string[];
  tagId: string[];
  title: string;
  description: string;
  assignedUserId: string[] | null;
  creatorId: string;
  deadline: Date;
  parentTickerId: string;
  childTicketId: string[];
}
