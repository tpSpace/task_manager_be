import { User } from "./index";

export interface Project {
  id: string;
  title: string;
  adminId: string;
  userId: string[];
  tagId: string[];
  stageId: string[];
  ticketId: string[];
  history: string[];
}
