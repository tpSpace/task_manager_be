import { User, Ticket } from "./index";
export interface Comment {
  commentId: string;
  author: User;
  authorId: string;
  ticket: Ticket;
  ticketId: string;
  content: string;
  timestamp: Date;
  versions: Comment[];
  basedOn?: Comment;
  basedOnId?: string | null;
}
