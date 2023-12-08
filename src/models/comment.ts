import { User, Ticket } from "./index";
export interface Comment {
  commentId: string;
  content: string;

  author: User;
  authorId: string;

  ticket: Ticket;
  ticketId: string;
}
