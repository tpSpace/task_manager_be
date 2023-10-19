import { User } from "./index";
export interface Ticket {
  title: string;
  description: string;
  comment: Comment;
  assigned_user: User;
  creator: User;
}
