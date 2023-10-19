import { User } from "./index";
export interface Ticket {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  assignedUserId: string | null;
  commentId: string[];
  dateCreated: Date;
  childTicketId: string[];
  isDeleted: boolean;
}
