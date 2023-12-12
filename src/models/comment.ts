import { User, Ticket } from '.';
export interface Comment {
  commentId: string;
  content: string;

  author: User;
  authorId: string;

  ticket: Ticket;
  ticketId: string;
}
