import { User } from "./index";

export interface Project {
  id: string;
  adminId: string;
  userId: string;
  title: string;
  tagId: string[];
  stageId: string[];
  ticketId: string[];
  dateCreated: Date;
}
